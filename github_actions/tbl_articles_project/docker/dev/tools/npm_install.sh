#! /bin/bash

#######################################################################
# workspaceディレクトリに移動し，package.jsonの生成またはインストールするシェル．
# 
# [例]
# $ bash ./npm_install.sh -w /opt/workspace/frontend/
# $ bash ./npm_install.sh -d -w ./
#######################################################################

dir_workspace=""
reinstall_npm_dependencies=false
while [ $# -gt 0 ]; do
    case $1 in
        -w)
            shift
            dir_workspace=$1
            ;;
        -d)
            reinstall_npm_dependencies=true
            ;;
        *)
            ;;
    esac
    shift
done
if [ -z ${dir_workspace} ]; then
    echo "Error: You should set workspace directory."
    exit 1
fi

# dir_workspaceにpackage.jsonやnode_modulesを配置させるので，移動する．
cd ${dir_workspace}

FILE="tmp_check_exist_file.txt"
ls ${dir_workspace}*.{json,sh} > $FILE
# cat $FILE
grep -E "package*\.json" $FILE
if [ ! $? = 0 ]; then
    # package*.jsonが無かったら初期package.jsonを生成する
    npm init -y

    # さらにnpm-install-dependencies.shがあったら依存モジュールの一括インストールする
    grep -E "npm-install-dependencies\.sh" $FILE
    if [ $? = 0 ]; then
        bash ${dir_workspace}npm-install-dependencies.sh
    fi
else
    # package*.jsonがあったらその依存モジュールをインストールする
    npm install --no-optional

    if ${reinstall_npm_dependencies}; then
        grep -E "npm-install-dependencies\.sh" $FILE
        if [ $? = 0 ]; then
            bash ${dir_workspace}npm-install-dependencies.sh
        else
            echo "Warning: Could not reinstall npm dependencies because of not found 'npm-install-dependencies.sh'."
        fi
    fi
fi
rm $FILE