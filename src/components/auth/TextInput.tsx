interface TextInputProps {
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  disabled?: boolean;
  minLength?: number;
  required?: boolean;
}

export default function TextInput({ label, type, value, onChange, placeholder, disabled, minLength, required }: TextInputProps) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '0.8rem', color: '#64748b', marginBottom: '0.4rem', fontWeight: '500' }}>
        {label}
      </label>
      <input 
        type={type} 
        value={value}
        onChange={onChange}
        placeholder={placeholder} 
        disabled={disabled}
        minLength={minLength}
        required={required}
        style={{
          width: '100%',
          boxSizing: 'border-box',
          padding: '12px 16px',
          backgroundColor: '#f1f5f9',
          border: 'none',
          borderRadius: '8px',
          outline: 'none',
          color: '#334155',
          fontSize: '0.9rem'
        }}
      />
    </div>
  );
}
