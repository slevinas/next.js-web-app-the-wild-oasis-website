"use client";

// Let's imagine your colleague already built this component 😃

function SelectCountry({ value, onChange, name, id, className, countries }) {
  // const countries = await getCountries();
  const flag = countries.find((country) => country.name === value)?.flag ?? "";

  return (
    <select
      name={name}
      id={id}
      // Here we use a trick to encode BOTH the country name and the flag into the value. Then we split them up again later in the server action
      value={`${value}%${flag}`}
      className={className}
    >
      <option value="">Select country...</option>
      {countries.map((c) => (
        <option key={c.name} value={`${c.name}%${c.flag}`}>
          {c.name}
        </option>
      ))}
    </select>
  );
}

export default SelectCountry;
