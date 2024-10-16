"use client";

import { getNotesProgram, getNotesProgramId } from "@project/anchor";
import { useConnection } from "@solana/wallet-adapter-react";
import { Cluster, Keypair, PublicKey } from "@solana/web3.js";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import toast from "react-hot-toast";
import { useCluster } from "../cluster/cluster-data-access";
import { useAnchorProvider } from "../solana/solana-provider";
import { useTransactionToast } from "../ui/ui-layout";

interface CreateNoteArgs {
  title: string;
  content: string;
  owner: PublicKey;
}

export function useNotesProgram() {
  const { connection } = useConnection();
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const provider = useAnchorProvider();
  const programId = useMemo(
    () => getNotesProgramId(cluster.network as Cluster),
    [cluster]
  );
  const program = getNotesProgram(provider);

  const accounts = useQuery({
    queryKey: ["notes", "all", { cluster }],
    queryFn: () => program.account.note.all(),
  });

  const getProgramAccount = useQuery({
    queryKey: ["get-program-account", { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  });
  const createNote = useMutation<string, Error, CreateNoteArgs>({
    mutationKey: ["note", "create", { cluster }],
    mutationFn: async ({ title, content, owner }) => {
      return program.methods.createNote(title, content).rpc();
    },
    onSuccess: (signature) => {
      transactionToast(signature);
      accounts.refetch();
    },
    onError: (error) => {
      toast.error(`Error creating note: ${error.message}`);
    },
  });
  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    createNote,
  };
}

export function useNotesProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const { program, accounts } = useNotesProgram();

  const accountQuery = useQuery({
    queryKey: ["notes", "fetch", { cluster, account }],
    queryFn: () => program.account.note.fetch(account),
  });
  const updateNote = useMutation<string, Error, CreateNoteArgs>({
    mutationKey: ["note", "update", { cluster }],
    mutationFn: async ({ title, content }) => {
      return program.methods.updateNote(title, content).rpc();
    },
    onSuccess: (signature) => {
      transactionToast(signature);
      accounts.refetch();
    },
    onError: (error) => {
      toast.error(`Error updating note: ${error.message}`);
    },
  });

  const deleteNote = useMutation({
    mutationKey: ["note", "delete", { cluster }],
    mutationFn: (title: string) => {
      return program.methods.deleteNote(title).rpc();
    },
    onSuccess: (signature) => {
      transactionToast(signature);
      accounts.refetch();
    },
    onError: (error) => {
      toast.error(`Error deleting note: ${error.message}`);
    },
  });

  return {
    accountQuery,
    updateNote,
    deleteNote,
  };
}
