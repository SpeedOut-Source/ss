"use client";
import React from "react";
import { trpc } from "../_trpc/client";

export default function page() {
  const todos = trpc.getTodos.useQuery();
  if (todos.isLoading) return <p>Error</p>;
  if (todos.error) return <p>Error</p>;

  return <div>testPage {todos.data}</div>;
}
