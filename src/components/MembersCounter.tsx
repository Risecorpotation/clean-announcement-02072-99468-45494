import { useEffect, useState } from "react";

const MembersCounter = () => {
  const [count, setCount] = useState(0);
  const targetCount = 4561;

  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = targetCount / steps;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      if (currentStep <= steps) {
        setCount(Math.floor(increment * currentStep));
      } else {
        setCount(targetCount);
        clearInterval(timer);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="w-full py-8 md:py-10 px-4 md:px-6">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-base md:text-lg text-muted-foreground mb-3">
          Contagem de membros...
        </p>
        <h3 className="text-5xl md:text-6xl lg:text-7xl font-bold text-primary">
          {count.toLocaleString('pt-BR')}
        </h3>
      </div>
    </section>
  );
};

export default MembersCounter;
