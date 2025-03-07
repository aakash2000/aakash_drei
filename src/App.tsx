import CobotAnimation from "./modules/cobotAnimation"

const App = () => {
  return (
    <div className="w-full">
      <div className="absolute top-0 right-0">
        <CobotAnimation />
      </div>
      <div className="w-full h-full">
        <span className="text-4xl font-bold text-center">Aakash Thakkar</span>
      </div>
    </div>
  );
};

export default App;