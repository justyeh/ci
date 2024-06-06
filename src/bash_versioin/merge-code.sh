#!/bin/bash

# 合并
echo -e "\033[32m 合并有新提交的项目 \033[0m"

# 获取需要合并代码的项目名称
project_dir=`awk '{print $1}' /Users/aikangcloud/Desktop/ci/difference.log`


# 清空error.log文件
>/Users/aikangcloud/Desktop/ci/error.log

# 遍历project_dir，执行代码合并
for each_project in $project_dir
do

	echo ""
    	echo -e "\033[32m $each_project 项目进行代码合并 \033[0m"
	cd /Users/aikangcloud/Desktop/$each_project && git checkout uat && git pull && git checkout release && git pull
	if [ $? -eq 0 ];then
		git merge uat -m 'Merge branch 'uat' into release by script' --no-ff
		if [ $? -eq 0 ];then
			git push && git checkout test
			if [ $? -eq 0 ];then
				echo -e "\033[32m $each_project 项目提交成功 \033[0m"

			else
				echo -e "\033[31m $each_project 项目提交失败 \033[0m"
        			echo "$each_project 提交出错"  >> /Users/aikangcloud/Desktop/ci/error.log
			fi
			
		else
			echo -e "\033[31m $each_project 有冲突，请手动解决 \033[0m"
			git merge --abort && echo "$each_project 有冲突，请手动解决"  >> /Users/aikangcloud/Desktop/ci/error.log
		fi
	else
		echo -e "\033[31m $each_project 切换分支失败 \033[0m"
		git merge --abort && echo "$each_project 切换分支失败"  >> /Users/aikangcloud/Desktop/ci/error.log
	fi
done


echo ""
echo -e "\033[31m 冲突： \033[0m"
cat /Users/aikangcloud/Desktop/ci/error.log