import React, { useEffect, useCallback } from "react";
import { useFormContext } from "react-hook-form";
import { useDebounce } from "@/hooks/useDebounce";
import { Input } from "../ui/input";
import { CheckCircle, XCircle } from "lucide-react";
import { BASE_URL } from "@/lib/base-url";
import { generateBaseUsername } from "@/lib/helper";
import { Spinner } from "../spinner";

const CheckUsername = ({ value, onChange }: { value?: string; onChange?: (value: string) => void }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isAvailable, setIsAvailable] = React.useState<boolean | null>(null);
  const [suggestions, setSuggestions] = React.useState<string[]>([]);
  const {  watch, setError, setValue, clearErrors } = useFormContext();
  const username = watch("username");

  const debouncedUsername = useDebounce(username, 500);

  const checkUsernameAvailability = useCallback(
    async (username: string) => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${BASE_URL}/api/check-username?username=${username}`
        );
        const data = await response.json();
        
        setIsAvailable(data.isAvailable);
        setSuggestions([]);
        clearErrors("username");
        
        if (!data.isAvailable) {
          const generatedSuggestions = Array(4)
            .fill(null)
            .map(() => generateBaseUsername(username));
          setSuggestions(generatedSuggestions);
          setError("username", { message: "Username is already taken" });
        }
      } catch (error) {
        console.log(error);
        setError("username", { message: "Error checking username" });
      } finally {
        setIsLoading(false);
      }
    },
    [setError, clearErrors]
  );

  useEffect(() => {
    if (debouncedUsername) {
      checkUsernameAvailability(debouncedUsername);
    }
  }, [debouncedUsername, checkUsernameAvailability]);

  const handleSuggestionClick = (suggestion: string) => {
    setValue("username", suggestion);
    clearErrors("username");
  };

  return (
    <div className="w-full relative">
     <Input
      placeholder="Username"
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      />
      
      {/* Loader and validation icons */}
      <div className="absolute right-3 top-2">
        {isLoading ? (
          <Spinner className="text-gray-600 !size-[20px]" />
        ) : isAvailable === true ? (
          <CheckCircle className="text-green-500" size={20} />
        ) : isAvailable === false ? (
          <XCircle className="text-red-500" size={20} />
        ) : null}
      </div>

      {/* Suggested usernames */}
      {isAvailable === false && suggestions.length > 0 && (
        <div className="mt-2 text-sm">
          <p className="mb-1">Suggestions</p>
          <ul className="flex flex-row gap-3 flex-wrap ml-[1px] text-base text-primary">
            {suggestions?.map((suggestion) => (
              <li
                role="button"
                key={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CheckUsername;