import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <section className="bg-background font-serif min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="flex justify-center">
          <div className="w-full sm:w-10/12 md:w-8/12 text-center">
            <div
              className="bg-[url(https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif)] h-[250px] sm:h-[350px] md:h-[400px] bg-center bg-no-repeat bg-contain"
              aria-hidden="true"
            >
              <h1 className="text-center text-foreground text-6xl sm:text-7xl md:text-8xl pt-6 sm:pt-8 font-display">
                404
              </h1>
            </div>

            <div className="mt-[-50px]">
              <h3 className="text-2xl text-foreground sm:text-3xl font-bold mb-4">
                Look like you're lost
              </h3>
              <p className="mb-6 text-muted-foreground sm:mb-5">
                The page you are looking for is not available!
              </p>

              <Button
                variant="default"
                onClick={() => navigate("/")}
                className="my-5"
              >
                Go to Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
