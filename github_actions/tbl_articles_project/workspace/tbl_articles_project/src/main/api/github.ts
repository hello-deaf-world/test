import axios, {type AxiosResponse} from "axios";

export type GHContentType = {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string;
  type: string;
  content: string;
  encoding: string;
};
export const getContents = async (ghURL: string): Promise<AxiosResponse<GHContentType[], any>> => {
  return await axios.get(ghURL, {});
};

export const getContent = async (ghURL: string): Promise<AxiosResponse<GHContentType, any>> => {
  return await axios.get(ghURL, {});
};
