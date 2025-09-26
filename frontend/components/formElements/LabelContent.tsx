interface LabelContentProps {
  label: string;
  value: string;
}

const LabelContent = ({ label, value }: LabelContentProps) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-text-light">{label}:</span>
      <p className="font-medium">{value}</p>
    </div>
  );
};

export default LabelContent;
