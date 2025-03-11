export default function FormattedText({ text, format = {} }) {
  const getFontSizeClass = (size) => {
    switch (size) {
      case "large":
        return "text-lg";
      case "larger":
        return "text-xl";
      case "largest":
        return "text-2xl";
      default:
        return "";
    }
  };

  return (
    <span
      className={`
          ${format.bold ? "font-bold" : ""}
          ${format.italic ? "italic" : ""}
          ${format.underline ? "underline" : ""}
          ${getFontSizeClass(format.fontSize)}
        `}
    >
      {text}
    </span>
  );
}
