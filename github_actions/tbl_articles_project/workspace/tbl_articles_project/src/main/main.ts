/*
各種記事yamlファイルからタグ等の情報を1つのデータベース風jsonに一元化するコマンドライン処理．
下記2つの処理方式を考えたが，(2)を採用する．
- (1)
  - GithubActionsのOS環境に本コードと記事一覧ディレクトリを含むレポジトリが丸ごとクローンされることを利用して，本コードは記事一覧ディレクトリからファイル操作によって処理する方式．
  - メリット
    - GithubAPIを使わないことによるGithubに対する通信負荷の軽減
  - デメリット
    - 本コードと記事一覧ディレクトリのレポジトリを別に管理する事になった時，本コードが使えない
- (2)
  - 本コードからGithubAPIで記事一覧を取得して処理する方式．
  - メリット/デメリットは(1)の逆

[tsxコマンドでの実行例]
- npm run dev -- -- "https://api.github.com/repos/hello-deaf-world/test/contents/articles_project" "./output/articles.json"
- npx tsx ./src/main/main.ts -- "https://api.github.com/repos/hello-deaf-world/test/contents/articles_project" "./output/articles.json"
[ビルド後のnodeコマンドでの実行]
- node dist/main.js -- "https://api.github.com/repos/hello-deaf-world/test/contents/articles_project" "./output/articles.json"
*/
import * as fs from "fs";
import yaml from "js-yaml";
import {getContents, getContent} from "~/api/github";
import {type ProjectType} from "~/types";

const articlesGHUrl: string = process.argv[3];
if (articlesGHUrl == null || articlesGHUrl.length === 0) {
  throw Error("The first command line argument 'articlesGHUrl'(='https://api.github.com/repos/<USERNAME>/<REPOSITORY_NAME>/contents/<REPOSITORY_PATH>') is required.");
}
const outputFname: string = process.argv[4];
if (outputFname == null || outputFname.length === 0) {
  throw Error("The second command line argument 'outputFname' is required.");
}

Promise.all([getContents(articlesGHUrl)])
  .then(async res => {
    const articleFnames: string[] = [];
    const resContents = res[0].data;
    const regpttn = /^[0-9]{7}_.+.yml$/g;
    resContents.forEach(content => {
      if (content.name.match(regpttn) !== null) {
        articleFnames.push(content.name);
      }
    });
    // console.log(articleFnames);
    await Promise.all(
      articleFnames.map(async fname => await getContent(`${articlesGHUrl}/${fname}`))
    )
      .then(async res => {
        const articles: Array<{
          fname: string;
          fpath: string;
          fsize: number;
          gh_url: string;
          html_url: string;
          git_url: string;
          download_url: string;
          content: ProjectType;
        }> = [];
        res.forEach(resArticle => {
          articles.push({
            fname: resArticle.data.name,
            fpath: resArticle.data.path,
            fsize: resArticle.data.size,
            gh_url: resArticle.data.url,
            html_url: resArticle.data.html_url,
            git_url: resArticle.data.git_url,
            download_url: resArticle.data.download_url,
            content: yaml.load(decodeURIComponent(escape(atob(resArticle.data.content)))) as ProjectType,
          });
        });
        // console.log(articles);
        const tblArticles: Array<{
          fname: string;
          fpath: string;
          fsize: number;
          gh_url: string;
          html_url: string;
          git_url: string;
          content: {
            creator: string;
            createDate: string;
            updateDate: string;
            content: {
              title: string;
              description: string;
              tags: string[];
            };
          };
        }> = [];
        articles.forEach(article => {
          tblArticles.push({
            fname: article.fname,
            fpath: article.fpath,
            fsize: article.fsize,
            gh_url: article.gh_url,
            html_url: article.html_url,
            git_url: article.git_url,
            content: {
              creator: article.content.creator,
              createDate: article.content.createDate,
              updateDate: article.content.updateDate,
              content: {
                title: article.content.content.title,
                description: article.content.content.description,
                tags: article.content.content.tags,
              },
            },
          });
        });
        // console.log(tblArticles);

        const outputDir = outputFname.split("/").slice(0, -1).join("/");
        if (!fs.existsSync(outputDir)) {
          fs.mkdir(outputDir, err => {
            if (err != null) {
              throw err;
            }
          });
        }
        fs.writeFileSync(outputFname, JSON.stringify(tblArticles, null, 2));
      })
      .catch(err => {
        throw err;
      });
  })
  .catch((err) => {
    throw err;
  });

