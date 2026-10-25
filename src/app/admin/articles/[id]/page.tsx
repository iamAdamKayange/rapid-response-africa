"use client";

import { useParams } from "next/navigation";
import ArticleEditor from "@/components/admin/ArticleEditor";

export default function EditArticlePage() {
  const { id } = useParams<{ id: string }>();
  return <ArticleEditor key={id} id={Number(id)} />;
}
