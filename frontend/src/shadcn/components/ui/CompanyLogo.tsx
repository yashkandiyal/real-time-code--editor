export default function CompanyLogo() {
  return (
    <div className="flex items-center justify-center">
      <div className=" rounded-full w-8 h-8 flex items-center justify-center">
        <CodeIcon className="w-5 h-5 text-primary-foreground" />
      </div>
      <h1 className="text-xl font-bold">CodeSync</h1>
    </div>
  );
}

function CodeIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}
