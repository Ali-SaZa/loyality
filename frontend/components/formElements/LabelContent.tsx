interface LabelContentProps {
  label: string;
  value: string;
}

const LabelContent = ({ label, value }: LabelContentProps) => {
  return (
    <div className="flex items-baseline gap-1">
      <label className="text-sm text-gray-500">{label}:</label>
      <div className="text-sm font-medium">{value}</div>
    </div>
  );
};

export default LabelContent;
