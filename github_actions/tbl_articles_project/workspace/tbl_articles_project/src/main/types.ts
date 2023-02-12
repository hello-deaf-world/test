/*
基本的に記事を表示するWebアプリの状態管理で定義した型を持ってきてる．
*/

export type ProcessType = {
  process: string;
  status: "completed" | "ongoing" | "untouched";
  detail?: string;
};

export type ImgTileType = { // TODO: 定義する場所として微妙かもしれない
  name: string;
  imageLink: string;
};

export type ProjectType = {
  creator: string;
  createDate: string;
  updateDate: string;
  content: {
    title: string;
    description: string;
    imageLinks: string[];
    missions: ProcessType[];
    processes: ProcessType[];
    tools: ImgTileType[];
    // WARNING: `https://github.com/<ユーザ・組織名>/<レポジトリ名>`までのURL．
    githubRepoLink: string;
    // GithubAPI`https://api.github.com/repos/<ユーザ・組織名>/<レポジトリ名>/contributors`で取得した結果を格納する
    contributors: ImgTileType[];
    tags: string[];
  };
};
