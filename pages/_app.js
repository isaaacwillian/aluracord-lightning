function GlobalStyle() {
  return (
    <style global jsx>{`
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        list-style: none;
      }
      body {
        font-family: "Open Sans", sans-serif;
      }
      .loadingBox {
        background-image: url("https://media2.giphy.com/media/L05HgB2h6qICDs5Sms/giphy.gif?cid=ecf05e471gmuk7samto8msgk6ai6i49no07uq0ynp03m4kky&rid=giphy.gif&ct=s");
        background-size: 50px 50px;
        background-repeat: no-repeat;
        background-position: center;
      }
      .loading {
        background-image: url("https://media4.giphy.com/media/McUBKCpESJD0F7eqzT/200w.webp?cid=ecf05e47hyonivomvvug3nitsm3ne55y8f5bogveo4ciw1yx&rid=200w.webp&ct=s");
        background-repeat: no-repeat;
        background-position: center;
      }
      /* App fit Height */
      html,
      body,
      #__next {
        min-height: 100vh;
        display: flex;
        flex: 1;
      }
      #__next {
        flex: 1;
      }
      #__next > * {
        flex: 1;
      }
      /* ./App fit Height */
    `}</style>
  );
}

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <GlobalStyle />
      <Component {...pageProps} />
    </>
  );
}
