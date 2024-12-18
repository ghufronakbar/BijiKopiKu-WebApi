import Link from "next/link";

const formatContent = ({
  content,
  onClick,
}: {
  content: string;
  onClick?: () => void;
}) => {
  const lines = content.split("\n");
  return lines.map((line, lineIndex) => {
    const words = line.split(/(\s+)/);
    return (
      <span key={lineIndex}>
        {words.map((word, wordIndex) => {
          if (word.startsWith("#")) {
            const cleanWord = word.substring(1);
            return (
              <Link
                key={wordIndex}
                href={`/post?search=${encodeURIComponent(cleanWord)}`}
                prefetch={false}
                onClick={onClick}
                className="text-blue-500 hover:underline"
              >
                <span className="text-blue-500 hover:underline">{word}</span>
              </Link>
            );
          }
          return word;
        })}
        {lineIndex < lines.length - 1 && <br />}
      </span>
    );
  });
};

export default formatContent;
