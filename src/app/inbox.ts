import type { inboxType } from "@/backendProvider";
import supabase from "@/supabaseClient";

export async function getInboxes(email: string) {
  const { data, error } = await supabase
    .from("Inboxes")
    .select("*")
    .eq("created_by", email);
  if (error) throw error;
  return data;
}
export async function createInbox(inbox: inboxType) {
  const { data, error } = await supabase.from("Inboxes").insert(inbox);
  if (error) throw error;
  return data;
}
// inbox_data
export async function getInboxData(id: string) {
  const { data, error } = await supabase
    .from("Inbox_data")
    .select("*")
    .eq("inbox_id", id);
  if (error) throw error;
  return data;
}
