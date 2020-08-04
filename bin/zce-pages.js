#!/usr/bin/env node

// console.log('zce-pages-----------222222')

// console.log(process.argv) // [ '/usr/local/bin/node', '/usr/local/bin/zce-pages' ]

/** 命令行传递的参数 process.argv  */
process.argv.push('--cwd')
process.argv.push(process.cwd())
process.argv.push('--gulpfile') // 指定gulpfile的路径，就是下面一行的libs/index.js
process.argv.push(require.resolve('..')) // libs/index是入口文件，等同于 process.argv.push(require.resolve('../libs/index'))

// 如果执行 zce-pages --aa bb
// console.log(process.argv) // [ '/usr/local/bin/node', '/usr/local/bin/zce-pages', '--aa', 'bb', '--cwd', '/demo/大前端/自动化构建/zce-gulp-demo','--gulpfile', '/demo/大前端/自动化构建/zce-pages/lib/index.js']

// 执行 zce-pages build, 就开始构建了


require('gulp/bin/gulp')

// const program = require('commander')
// const pkg = require('../package')
// const zcePages = require('..')

// program
//   .version(pkg.version)
//   .usage('<input>')
//   .option('-H, --host', 'Email host')
//   .on('--help', console.log)
//   .parse(process.argv)
//   .args.length || program.help()

// const { args, host } = program
// const [ input ] = args

// // TODO: Implement module cli
// console.log(zcePages(input, { host }))
