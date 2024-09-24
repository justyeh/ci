const { getReadlineInput, getDiffProjectList } = require('./util')
const chalk = require('chalk')

async function main() {
	const branchs = process.argv.slice(2)
	if (branchs.length === 1) {
		const branchName = await getReadlineInput()
		branchs.push(branchName)
	}
	const [targetBranch, sourceBranch] = branchs

	const diffProjectList = await getDiffProjectList({ targetBranch, sourceBranch }, true)
	if (diffProjectList.length > 0) {
		console.log(chalk.bgYellow.white('以下项目需要合并代码：\n\r' + diffProjectList.join('\n\r')))
	} else {
		console.log(chalk.bgYellow.white('没有项目需要合并'))
	}
}

main()
