import { useHandleFetchUser } from "../api/user";
import { Header, Footer } from "../components";

function Messages() {
  useHandleFetchUser();
  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto pt-8 px-4">
        <h2 className="mb-4">Coming Soon...</h2>
      </div>
      <Footer />
    </>
  );
}

export default Messages;
