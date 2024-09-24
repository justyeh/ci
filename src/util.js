const { execSync } = require('child_process')
const fs = require('fs')
const readline = require('readline')
const chalk = require('chalk')

const maxBuffer = 100 * 1024 * 1024 // 设置缓冲区大小 100Mb

const IGNORE_PROJECT_LIST = [
	'ci',
	'registration',
	'tcyx-fe',
	'tcyx-flow-h5',
	'nutrition-admin',
	'nutrition-h5',
	'aikang-cloud-web',
	'temp',
	'yunyutong-admin',
	'yunyutong-doctor',
	'yunyutong-hospital',
	'yunyutong-school',
	'yunyutong-user',
	'dirty-form'
]

const DESKTOP_PATH = '/Users/aikangcloud/Desktop/'

function isDiffBranch({ targetBranch, sourceBranch, cwd }) {
	try {
		execSync(`git fetch`)
		execSync(`git checkout ${sourceBranch} && git pull`, { cwd })
		execSync(`git checkout ${targetBranch} && git pull`, { cwd })
		const diff = execSync(`git diff ${targetBranch} ${sourceBranch}`, { cwd, maxBuffer })
		return diff.length > 0
	} catch (error) {
		if (JSON.stringify(error).indexOf('did not match any file(s) known to git') > -1) {
			console.log(chalk.red(error))
		}
		return false
	}
}

function getPorjectList() {
	const result = []
	try {
		const dirList = fs.readdirSync(DESKTOP_PATH)

		for (let i = 0; i < dirList.length; i++) {
			const project = dirList[i]
			if (IGNORE_PROJECT_LIST.includes(project)) {
				continue
			}
			const stat = fs.statSync(DESKTOP_PATH + project)
			if (stat.isDirectory()) {
				result.push(project)
			}
		}
	} catch (error) {
		console.log(chalk.red(error))
	}
	return result
}

function getReadlineInput() {
	return new Promise((resolve) => {
		const rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout
		})
		rl.question('请输入需要对比的分支：', (str) => {
			resolve(str)
			rl.close()
		})
	})
}

function getDiffProjectList({ targetBranch, sourceBranch }) {
	const diffProjectList = []

	const list = getPorjectList()
	for (let i = 0; i < list.length; i++) {
		const project = list[i]
		console.log(chalk.blue('检查项目：' + project))

		const cwd = DESKTOP_PATH + project
		const isDiff = isDiffBranch({ targetBranch, sourceBranch, cwd })
		if (isDiff) {
			diffProjectList.push(project)
		} else {
			execSync(`git checkout test`, { cwd })
		}

		console.log('\n\r')
	}
	return diffProjectList
}

function mergeCode({ targetBranch, sourceBranch, cwd }) {
	try {
		execSync(`git checkout ${sourceBranch} && git pull`, { cwd })
		execSync(`git checkout ${targetBranch} && git pull`, { cwd })
		execSync(`git merge ${sourceBranch}`, { cwd })
		execSync(`git push`, { cwd })
		execSync(`git checkout test`, { cwd })
		return true
	} catch (error) {
		console.log(chalk.red(error))
	}
	return false
}

module.exports = {
	DESKTOP_PATH,
	getReadlineInput,
	getDiffProjectList,
	mergeCode
}
