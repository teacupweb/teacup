import type { CompanyType } from '@/backendProvider';
import supabase from '@/supabaseClient';

export async function getCompanyById(id: string) {
  // TODO: Implement Supabase query to fetch company by id
  // const { data, error } = await supabase
  //   .from('companies')
  //   .select('*')
  //   .eq('id', id)
  //   .single();
  // if (error) {
  //   console.log(error);
  // }
  // return data;
  
  console.log('getCompanyById called with id:', id);
  return null;
}

export async function createCompany(company: CompanyType) {
  // TODO: Implement Supabase insert for new company
  // The company object should include all fields from CompanyType
  // After creating the company, you should also update the user's metadata
  // to include the company_id
  
  // const { data, error } = await supabase
  //   .from('companies')
  //   .insert(company)
  //   .select()
  //   .single();
  // if (error) {
  //   console.log(error);
  //   return null;
  // }
  
  // // Update user metadata with company_id
  // const { error: updateError } = await supabase.auth.updateUser({
  //   data: { company_id: data.id }
  // });
  // if (updateError) {
  //   console.log(updateError);
  // }
  
  // return data;
  
  console.log('createCompany called with:', company);
  return null;
}

export async function updateCompany(id: string, company: CompanyType) {
  // TODO: Implement Supabase update for existing company
  // const { data, error } = await supabase
  //   .from('companies')
  //   .update(company)
  //   .eq('id', id)
  //   .select()
  //   .single();
  // if (error) {
  //   console.log(error);
  // }
  // return data;
  
  console.log('updateCompany called with id:', id, 'and data:', company);
  return null;
}
