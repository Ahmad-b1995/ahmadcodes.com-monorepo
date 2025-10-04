import React from "react";
import Header from "@/components/Header";
import Homepage from "@/components/Homepage";

const App = async () => {

  return (
    <div className="lg:flex lg:justify-between lg:gap-4">
      <Header />
      <Homepage />
    </div>
  );
};

export default App;
