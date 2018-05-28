# gulp-css-toc

Appends a TOC to the beginning of a CSS file. The header must be formatted as given below.

## Install

```
$ npm install --save-dev gulp-css-toc
```


## Usage

```js
var gulp = require('gulp');
var gulpCssToc = require('gulp-css-toc');

gulp.task('default', function () {
	return gulp.src('src/style.css')
		.pipe(gulpCssToc())
		.pipe(gulp.dest('dist'));
});
```

## Input

Headings must be styled as so:

```css
/* ===================================================== */
/* Header Styles                                         */
/* ===================================================== */
```

## Output

Appended to the beginning of the file will be as so:

```css
/*
- Header Styles
- Body Styles
- Footer Styles
*/
```
