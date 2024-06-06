const { getDiffProjectList, mergeCode, DESKTOP_PATH } = require('./util')
const chalk = require('chalk')

async function main() {
	const targetBranch = 'release'
	const sourceBranch = 'uat'

	const diffProjectList = getDiffProjectList({ targetBranch, sourceBranch })
	if (diffProjectList.length === 0) {
		console.log(chalk.bgYellow.white('没有项目需要合并'))
		return
	} else {
		console.log(chalk.bgYellow.white('以下项目需要合并代码：\n\r' + diffProjectList.join('\n\r')))
		console.log(chalk.bgYellow.white('\n\r'))
	}

	const errorList = []

	for (let i = 0; i < diffProjectList.length; i++) {
		const project = diffProjectList[i]
		console.log(chalk.blue('合并代码：' + project))
		const mergeSuccess = mergeCode({ targetBranch, sourceBranch, cwd: DESKTOP_PATH + project })
		if (!mergeSuccess) {
			errorList.push(project)
		}
		console.log('\n\r')
	}

	if (errorList.length > 0) {
		console.log(bgYellow.white('以下项目合并出错：\n\r' + errorList.join('\n\r')))
	}
}

main()
