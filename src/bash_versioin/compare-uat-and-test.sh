#!/bin/bash

# 检查代码
echo -e "\033[32m 检查test和uat是否有差异 \033[0m"

# 罗列Desktop的代码目录，egrep 取反，列表后面的项目忽略
project_dir=`ls /Users/aikangcloud/Desktop | egrep -v '忽略的项目|ci|registration|tcyx-fe|tcyx-flow-h5|nutrition-admin|nutrition-h5|aikang-cloud-web|temp|yunyutong-admin|yunyutong-doctor|yunyutong-hospital|yunyutong-school|yunyutong-user|dirty-form'`

# 清空difference.log文件
>/Users/aikangcloud/Desktop/ci/difference.log

# 清空error.log文件
>/Users/aikangcloud/Desktop/ci/error.log

# 遍历project_dir，对比uat上是否有新的提交，如果有，将项目名称输出到difference.log文件
for each_project in $project_dir
do
    echo ""
    echo -e "\033[32m 检查 $each_project 项目test和uat是否有差异 \033[0m"
    cd /Users/aikangcloud/Desktop/$each_project && git checkout uat && git pull && git checkout test && git pull;
    if [ $? -eq 0 ];then
        if [ $(git log uat..test | wc -l) -gt 1 ];then
            git checkout uat
            echo -e "\033[32m $each_project 需要合并代码 \033[0m"
            echo "$each_project 需要合并代码" >> /Users/aikangcloud/Desktop/ci/difference.log
        fi
    else
        echo -e "\033[31m $each_project 出错 \033[0m"
        echo "$each_project 出错"  >> /Users/aikangcloud/Desktop/ci/error.log
    fi
done

echo ""
echo -e "\033[32m 结果： \033[0m"
cat /Users/aikangcloud/Desktop/ci/difference.log

echo ""
echo -e "\033[31m 错误： \033[0m"
cat /Users/aikangcloud/Desktop/ci/error.log


