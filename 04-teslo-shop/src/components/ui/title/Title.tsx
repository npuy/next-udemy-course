import { titleFont } from "@/config/fonts";

interface TitleProps {
  title: string;
  subTitle?: string;
  className?: string;
}

export const Title = ({ title, subTitle, className }: TitleProps) => {
  return (
    <div className={`mt-3 mb-5 ${className}`}>
      <h1
        className={`${titleFont.className} antialiased text-4xl font-semibold my-7`}
      >
        {title}
      </h1>

      {subTitle && <h2 className="text-xl">{subTitle}</h2>}
    </div>
  );
};
