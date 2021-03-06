<p align="center">
  <a href="https://brunobarros.dev">
    <img alt="Bruno's Logo" src="https://brunobarros.dev/img/favicon.png" width="128" />
  </a>
</p> 
<h3 align="center">:wave: Hi! I'm Bruno Barros</h2>
<p align="center">A Web Developer</p>

## :thinking: What is it?

This is function that returns a file with the computed CSS added of elements in any way: inline, classes, ids, etc. \
\
In some cases, existing solutions were not enough and I was trying to have some fun creating something different. \
\
You just have to point some url, an array of ids, classes or anything that a querySelectorAll can grab. \
\
The option null will return everything from document body \
\
You have one file to include elements that you want and one to exclude attributes \
\
By the end, the result is a CSS file with the custom CSS added to all elements selected. \
\
***Obs:*** *If you're using this, would you be kind to tell me how useful it is to you?*

## :rocket: Quick start

### Step 1: Clone The Repo

Fork the repository, then clone the repo locally by doing -

```bash
git clone https://github.com/bobarros/customcss-to-file
```

### Step 2: Install Dependencies

cd into the directory

```bash
cd customcss-to-file
```

install all the dependencies
```bash
yarn install
or
npm install
```

### Step 3: Editing variables or not

I'm using Google's website as a placeholder if you just want to test. \
Replace with your target on getCSS.js, if you will.
```
const targetUrl = "https://www.google.com/";
```

Now, just run:

```
yarn start
or maybe
node getCSS.js
```

## Dependencies

**1.** puppeteer

## :v: Reach me

Feel free to tell me about errors or improvements.

I wish you all the best! :hugs: