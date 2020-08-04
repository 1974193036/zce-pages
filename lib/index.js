const del = require('del') // 清除文件，返回promise
const browserSync = require('browser-sync') // 开发服务器
const loadPlugins = require('gulp-load-plugins') // 自动加载插件

const bs = browserSync.create()
const plugins = loadPlugins()



const { src, dest, series, parallel, watch } = require('gulp') // src: 文件读取流，dest: 文件写入流，series: 串行执行，parallel: 并行执行，watch: 监听文件变化
// const sass = require('gulp-sass') // sass编译
// const babel = require('gulp-babel') // es6编译，(npm install gulp-babel @babel/core @babel/preset-env --save-dev)
// const swig = require('gulp-swig') // 页面模板编译
// const imagemin = require('gulp-imagemin') // 图片，字体文件 压缩
// const useref = require('gulp-useref') // 构建注释（文件引用），注释文字 中间部分的css,js引用会合并到注释的文件内，针对 href="/node_modules/bootstrap/dist/css/bootstrap.css"
// const htmlmin = require('gulp-htmlmin') // 压缩html
// const uglify = require('gulp-uglify') // 压缩js
// const cleanCss = require('gulp-clean-css') // 压缩css
// const if = require('gulp-if') // 判断读取流中的文件类型


// data数据抽取到外部，data不能作为公共模块在这使用
const cwd = process.cwd()
let config = {
  // default config
  build: {
    src: 'src',
    dist: 'dist',
    temp: 'temp',
    public: 'public',
    paths: {
      styles: 'assets/styles/*.scss',
      scripts: 'assets/scripts/*.js',
      pages: '*.html',
      images: 'assets/images/**',
      fonts: 'assets/fonts/**'
    }
  }
}

try {
  const loadConfig = require(`${cwd}/pages.config.js`)
  config = Object.assign({}, config, loadConfig)
} catch (e) {

}

// const data = require('pages.config.js').data
// const data = {
//   menus: [
//     {
//       name: 'Home',
//       icon: 'aperture',
//       link: 'index.html'
//     },
//     {
//       name: 'Features',
//       link: 'features.html'
//     },
//     {
//       name: 'About',
//       link: 'about.html'
//     },
//     {
//       name: 'Contact',
//       link: '#',
//       children: [
//         {
//           name: 'Twitter',
//           link: 'https://twitter.com/w_zce'
//         },
//         {
//           name: 'About',
//           link: 'https://weibo.com/zceme'
//         },
//         {
//           name: 'divider'
//         },
//         {
//           name: 'About',
//           link: 'https://github.com/zce'
//         }
//       ]
//     }
//   ],
//   pkg: require('./package.json'),
//   date: new Date()
// }

// 清除文件，返回promise
const clean = () => {
  // return del(['dist', 'temp'])
  return del([config.build.dist, config.build.temp])
}

// sass编译
const style = () => {
  // return src('src/assets/styles/*.scss', { base: 'src' }) // 基路径是src，会把'src/assets/styles/*.scss'的src后面的路径写入到dist目录
  //   .pipe(plugins.sass({ outputStyle: 'expanded' })) // sass编译完成的css文件书写风格大括号完全展开
  //   .pipe(dest('temp'))
  //   .pipe(bs.reload({ stream: true }))
  return src(config.build.paths.styles, { base: config.build.src, cwd: config.build.src }) // 基路径是src，会把'src/assets/styles/*.scss'的src后面的路径写入到dist目录，cwd: cwd的路径会拼接到src路径上
    .pipe(plugins.sass({ outputStyle: 'expanded' })) // sass编译完成的css文件书写风格大括号完全展开
    .pipe(dest(config.build.temp))
    .pipe(bs.reload({ stream: true }))
}

// es6编译
const script = () => {
  // return src('src/assets/scripts/*.js', { base: 'src' })
  //   // .pipe(plugins.babel({ presets: ['@babel/preset-env'] }))
  //   .pipe(plugins.babel({ presets: [require('@babel/preset-env')] }))
  //   .pipe(dest('temp'))
  //   .pipe(bs.reload({ stream: true }))
  return src(config.build.paths.scripts, { base: config.build.src, cwd: config.build.src })
    // .pipe(plugins.babel({ presets: ['@babel/preset-env'] }))
    .pipe(plugins.babel({ presets: [require('@babel/preset-env')] }))
    .pipe(dest(config.build.temp))
    .pipe(bs.reload({ stream: true }))
}

// 页面模板编译
const page = () => {
  // return src('src/*.html', { base: 'src' })
  //   .pipe(plugins.swig({ data: config.data, defaults: { cache: false } })) // 防止模板缓存导致页面不能及时更新
  //   .pipe(dest('temp'))
  //   .pipe(bs.reload({ stream: true }))
  return src(config.build.paths.pages, { base: config.build.src, cwd: config.build.src })
    .pipe(plugins.swig({ data: config.data, defaults: { cache: false } })) // 防止模板缓存导致页面不能及时更新
    .pipe(dest(config.build.temp))
    .pipe(bs.reload({ stream: true }))
}

// 图片压缩
const image = () => {
  // return src('src/assets/images/**', { base: 'src' })
  //   .pipe(plugins.imagemin())
  //   .pipe(dest('dist'))
  return src(config.build.paths.images, { base: config.build.src, cwd: config.build.src })
    .pipe(plugins.imagemin())
    .pipe(dest(config.build.dist))
}

// 字体文件压缩
const font = () => {
  // return src('src/assets/fonts/**', { base: 'src' })
  //   .pipe(plugins.imagemin())
  //   .pipe(dest('dist'))
  return src(config.build.paths.fonts, { base: config.build.src, cwd: config.build.src })
    .pipe(plugins.imagemin())
    .pipe(dest(config.build.dist))
}

// 其他额外文件
const extra = () => {
  // return src('public/**', { base: 'public' })
  //   .pipe(dest('dist'))
  return src('**', { base: config.build.public, cwd: config.build.public })
    .pipe(dest(config.build.dist))
}

const serve = () => {
  watch(config.build.paths.styles, { cwd: config.build.src }, style)
  watch(config.build.paths.scripts, { cwd: config.build.src }, script)
  watch(config.build.paths.pages, { cwd: config.build.src }, page)
  // 开发阶段减少构建次数
  // watch('src/assets/images/**', image)
  // watch('src/assets/fonts/**', font)
  // watch('public/**', extra)
  watch([
    // 'src/assets/images/**',
    // 'src/assets/fonts/**',
    // 'public/**'
    config.build.paths.images,
    config.build.paths.fonts
  ], { cwd: config.build.src }, bs.reload)

  watch('**', { cwd: config.build.public }, bs.reload)

  bs.init({
    notify: false, // 去掉右上角提示'Browsersync: connected'
    port: 3000,
    open: true, // 自动打开浏览器
    // files: 'dist/**', // dist目录下被监听的文件产生变化，浏览器自动刷新，也可以使用 bs.reload
    server: {
      baseDir: [config.build.temp, config.build.src, config.build.public], // 启动文件目录，index.html读取dist目录下，图片字体等如果在dist下找不到就去src和public下找
      routes: {
        '/node_modules': 'node_modules' // index.html中设置静态资源指向
      }
    }
  })
}

const useref = () => {
  // return src('temp/*.html', { base: 'temp' })
  // .pipe(plugins.useref({ searchPath: ['temp', '.'] }))
  // // html js css
  // .pipe(plugins.if(/\.js$/, plugins.uglify()))
  // .pipe(plugins.if(/\.css$/, plugins.cleanCss()))
  // .pipe(plugins.if(/\.html$/, plugins.htmlmin({
  //   collapseWhitespace: true,
  //   minifyCSS: true,
  //   minifyJS: true
  // })))
  // .pipe(dest('dist'))

  return src(config.build.paths.pages, { base: config.build.temp, cwd: config.build.temp })
    .pipe(plugins.useref({ searchPath: [config.build.temp, '.', '..'] })) // 从dist目录（如asets/styles/main.css），和项目根目录找（如/node_modules/bootstrap/dist/css/bootstrap.css）
    // html js css
    .pipe(plugins.if(/\.js$/, plugins.uglify()))
    .pipe(plugins.if(/\.css$/, plugins.cleanCss()))
    .pipe(plugins.if(/\.html$/, plugins.htmlmin({
      collapseWhitespace: true,
      minifyCSS: true,
      minifyJS: true
    })))
    .pipe(dest(config.build.dist))
}

const compile = parallel(style, script, page)

// 上线之前执行的任务
const build = series(
  clean,
  parallel(
    series(compile, useref),
    image,
    font,
    extra
  )
)

// 开发阶段执行的任务，开发阶段尽可能的减少构建次数，让图片字体等读取src下，让html css js读取dist下
const develop = series(compile, serve)


module.exports = {
  // style, // gulp style: 生成一个main.css、demo.css文件，下划线开头的_icons.scss，_variables.scss会被sass()认为是依赖文件自动忽略
  // script,
  // page,
  // image,
  // font,
  // clean,
  // compile,
  // build,
  // serve,
  // develop,
  // useref
  clean,
  build,
  develop
}