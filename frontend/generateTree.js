const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const IGNORED_FOLDERS = ['node_modules', '.next', '.git', '.idea', '.vscode', '.husky'] // پوشه‌هایی که نادیده می‌گیریم
const OUTPUT_FILE = 'structure.txt' // نام فایل خروجی

let dirCount = 0 // شمارش دایرکتوری‌ها
let fileCount = 0 // شمارش فایل‌ها

function generateTree(dir, depth = 0) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })

  return entries
    .filter((entry) => !IGNORED_FOLDERS.includes(entry.name))
    .map((entry) => {
      const prefix = '  '.repeat(depth) + (entry.isDirectory() ? '📁 ' : '📄 ')

      if (entry.isDirectory()) {
        dirCount++

        return prefix + entry.name + '\n' + generateTree(path.join(dir, entry.name), depth + 1)
      } else {
        fileCount++

        return prefix + entry.name
      }
    })
    .join('\n')
}

function writeTreeToFile() {
  const treeStructure = generateTree(process.cwd())
  const summary = `\n\n${dirCount} directories, ${fileCount} files`

  fs.writeFileSync(OUTPUT_FILE, treeStructure + summary, 'utf-8')
  console.log(`Project structure saved to ${OUTPUT_FILE}`)
  console.log(summary.trim())

  // اضافه کردن فایل به stage
  execSync(`git add ${OUTPUT_FILE}`)
  console.log(`${OUTPUT_FILE} staged for commit.`)
}

writeTreeToFile()
