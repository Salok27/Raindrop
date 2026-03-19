import React from 'react';

interface HeaderProps {
	city: string;
	temp: string;
	desc?: string;
}

const Header: React.FC<HeaderProps> = ({ city, temp, desc }) => {
	return (
		<header className="text-center">
			<div className="text-xl font-medium text-slate-200 mb-1">{city}</div>
			<div className="text-5xl font-light tracking-tight">{temp}</div>
			{desc && (
				<div className="text-sm text-slate-400 mt-2">{desc}</div>
			)}
		</header>
	);
};

export default Header;
