export default function errorPage() {
  return (
    <div>
      <h1>Error 404</h1>
      <h2>Página não encontrada :/</h2>
      <style jsx>{`
        div {
          background-image: url("https://images.unsplash.com/photo-1472457897821-70d3819a0e24?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80");
          background-repeat: no-repeat;
          background-size: cover;
          display: flex;
          align-content: center;
          justify-content: center;
          flex-wrap: wrap;
          text-align: center;
          gap: 20px;
        }
        h1 {
          width: 100%;
          font-size: 4rem;
        }
        h2 {
          width: 100%;
          font-size: 2rem;
        }
      `}</style>
    </div>
  );
}
