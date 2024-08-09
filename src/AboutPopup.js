import React from 'react';

const AboutPopup = ({ onClose }) => {
  return (
    <div className="popup">
      <div className="popup-content">
        <button onClick={onClose} className="close-button">Close</button>
        <h2>Background</h2>
        <p>
        After the neo-Amish induced crypto-collapse of '47, USA ceased to exist as a nation.
        Following the discovery in '73 of vast reserves of Rareium, the fallen nation again had the world's attention, however this time as a resource.
        The now powerful Mexican queendom and the Pan-Canadia Inuit Alliance are both greedily claiming territory. Clashes are unavoidable.
        </p>
        <h2>The Mexican Queendom</h2>
        <p>
        The Mexican Queendom is a matriarchal society where the queen is both the head of state and the head of the church.
        The Queendom is a mix of Aztec and Spanish culture, with a strong emphasis on the Aztec warrior culture.
        </p>
        <h2>The Pan-Canadia Inuit Alliance</h2>
        <p>
        The Pan-Canadia Inuit Alliance is a confederation of Inuit tribes that have banded together to protect their lands.
        The Alliance is a mix of traditional Inuit culture and modern Canadian culture, with a strong emphasis on Inuit hunting traditions.
        </p>
      </div>
    </div>
  );
};

export default AboutPopup;