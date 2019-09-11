const colors = {
  accent: "#F3534A", //đỏ
  primary: "#0AC4BA",//xanh da trời
  secondary: "#2BDA8E", //xanh 
  tertiary: "#FFE358", //vàng
  black: "#323643",
  white: "#FFFFFF",
  gray: "#9DA3B4",
  gray2: "#C5CCD6",
  gray3: "#E6E6E6",
  red: '#DF0101',
  pink: '#993399',
  violet: '#663366',

};

const sizes = {
  // global sizes
  base: 16,
  font: 14,
  radius: 20,
  padding: 25,
  base1: 1,
  // font sizes
  h1: 26,
  h2: 20,
  h3: 18,
  title: 18,
  header: 16,
  body: 14,
  caption: 12,
};

const fonts = {
  h1: {
    fontSize: sizes.h1
  },
  h2: {
    fontSize: sizes.h2
  },
  h3: {
    fontSize: sizes.h3
  },
  header: {
    fontSize: sizes.header
  },
  title: {
    fontSize: sizes.title
  },
  body: {
    fontSize: sizes.body
  },
  caption: {
    fontSize: sizes.caption
  },
};

export { colors, sizes, fonts };