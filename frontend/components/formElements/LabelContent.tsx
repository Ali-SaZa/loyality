interface LabelContentProps {
  label: string;
  value: string;
}

const LabelContent = ({ label, value }: LabelContentProps) => {
  return (
    <div className="flex items-center gap-1">
      <label className="text-sm text-text-light">{label}:</label>
      <div className="font-medium">{value}</div>
    </div>
  );
};

export default LabelContent;
