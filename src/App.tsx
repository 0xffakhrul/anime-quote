import { useEffect, useState } from "react";
import axios from "axios";

import "./App.css";
import { BadgeJapaneseYen, Loader } from "lucide-react";

interface Quote {
  id: number;
  quote: string;
  anime: string;
  character: string;
}

function App() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [animeTitle, setAnimeTitle] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRandomQuote();
  }, []);

  const fetchRandomQuote = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("https://animechan.xyz/api/random");
      setQuote(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching data", error);
      setError("Error fetching random quote. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchQuoteByTitle = async () => {
    const searchItem = animeTitle.trim().toLowerCase();
    if (!searchItem) {
      return;
    }
    setIsLoading(true);

    try {
      const response = await axios.get(
        `https://animechan.xyz/api/random/anime?title=${encodeURIComponent(
          animeTitle.trim()
        )}`
      );
      const result = response.data;

      if (result.anime && result.anime.toLowerCase() === searchItem) {
        setQuote(result);
      } else {
        setError(`No quote found for anime ${animeTitle}`);
        setQuote(null);
      }
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnimeTitle(e.target.value);
  };
  return (
    <>
      <div className="texts">
        <h1>Anime Quote Generator</h1>
        <p>Lorem ipsum dolor sit amet.</p>
      </div>
      <div className="grid">
        <div className="input-field">
          <input type="text" value={animeTitle} onChange={handleInputChange} />
          <button onClick={fetchQuoteByTitle} className="generate-button">
            Generate
          </button>
        </div>
        <div className="box">
          {isLoading ? (
            <Loader width={50} height={50} className="loading" />
          ) : (
            <>
              {error ? (
                <div>{error}</div>
              ) : (
                <div>
                  <p className="quote-no">Quote#{quote?.id}</p>
                  <p className="quote">{quote?.quote}</p>
                  <p className="quote-character">~ {quote?.character}</p>
                </div>
              )}
              <button className="generate" onClick={fetchRandomQuote}>
                <BadgeJapaneseYen />
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
