const fs = require('fs');
const crypto = require('crypto');

function hashString(str) {
  return crypto.createHash('md5').update(str).digest('hex').substring(0, 8);
}

const rawText = `
# 📘 Class 11 Chemistry

# Chapter 1: Some Basic Concepts of Chemistry

### Introduction

* Importance of Chemistry
* Scope of Chemistry

### Particulate Nature of Matter

* Historical Development
* Laws of Chemical Combination

  * Law of Conservation of Mass
  * Law of Definite Proportions
  * Law of Multiple Proportions
  * Gay Lussac's Law
  * Avogadro's Law
* Dalton's Atomic Theory

### Atomic Mass & Mole Concept

* Atoms
* Molecules
* Atomic Mass
* Molecular Mass
* Formula Mass
* Mole Concept
* Avogadro Number
* Molar Mass

### Stoichiometry

* Percentage Composition
* Empirical Formula
* Molecular Formula
* Chemical Equations
* Balancing Reactions
* Stoichiometric Calculations

---

# Chapter 2: Structure of Atom

### Discovery of Subatomic Particles

* Electron
* Proton
* Neutron

### Atomic Models

* Thomson Model
* Rutherford Model
* Bohr Model
* Limitations of Each Model

### Quantum Mechanical Model

* Dual Nature of Matter
* de Broglie Equation
* Heisenberg Uncertainty Principle
* Orbitals
* Quantum Numbers
* Shapes of s, p, d Orbitals

### Electronic Configuration

* Aufbau Principle
* Pauli Exclusion Principle
* Hund's Rule
* Stability of Half-filled Orbitals
* Stability of Fully-filled Orbitals

---

# Chapter 3: Classification of Elements and Periodicity

* Development of Periodic Table
* Modern Periodic Law
* Modern Periodic Table
* Atomic Radius
* Ionic Radius
* Ionization Enthalpy
* Electron Gain Enthalpy
* Electronegativity
* Valency
* Trends in Periodic Table
* Nomenclature of Elements Beyond Atomic Number 100

---

# Chapter 4: Chemical Bonding and Molecular Structure

### Chemical Bonding

* Valence Electrons
* Ionic Bond
* Covalent Bond
* Bond Parameters
* Lewis Structure
* Polar Covalent Bond
* Covalent Character of Ionic Bond

### Bonding Theories

* Valence Bond Theory
* Resonance
* VSEPR Theory
* Hybridization

  * sp
  * sp²
  * sp³
  * dsp²
  * sp³d
  * sp³d²
* Molecular Orbital Theory (Basic)

### Hydrogen Bonding

* Intermolecular Hydrogen Bond
* Intramolecular Hydrogen Bond

---

# Chapter 5: States of Matter

### Gaseous State

* Three States of Matter
* Intermolecular Forces
* Boyle's Law
* Charles Law
* Gay Lussac Law
* Avogadro Law
* Ideal Gas Equation
* Gas Constant
* Kinetic Theory
* RMS Speed
* Real Gas
* Critical Temperature
* Liquefaction of Gases

### Liquid State

* Vapour Pressure
* Surface Tension
* Viscosity

---

# Chapter 6: Thermodynamics

* System
* Surroundings
* Types of Systems
* Heat
* Work
* Internal Energy
* Enthalpy
* First Law
* Heat Capacity
* Hess's Law
* Bond Enthalpy
* Enthalpy of Formation
* Combustion
* Atomization
* Sublimation
* Ionization
* Solution
* Entropy
* Second Law
* Gibbs Free Energy
* Third Law

---

# Chapter 7: Equilibrium

### Physical Equilibrium

### Chemical Equilibrium

* Dynamic Equilibrium
* Law of Mass Action
* Equilibrium Constant
* Le Chatelier Principle

### Ionic Equilibrium

* Strong Electrolytes
* Weak Electrolytes
* Degree of Ionization
* Acids
* Bases
* pH
* Hydrolysis
* Buffer Solution
* Henderson Equation
* Solubility Product (Ksp)
* Common Ion Effect

---

# Chapter 8: Redox Reactions

* Oxidation
* Reduction
* Oxidation Number
* Balancing Redox Reactions
* Electron Transfer Method
* Oxidation Number Method
* Applications

---

# Chapter 9: Hydrogen

* Position in Periodic Table
* Isotopes
* Preparation
* Properties
* Uses
* Hydrides
* Water
* Heavy Water
* Hydrogen Peroxide
* Hydrogen as Fuel

---

# Chapter 10: s-Block Elements

### Group 1

* Electronic Configuration
* Trends
* Chemical Properties
* Uses

### Important Compounds

* Sodium Carbonate
* Sodium Chloride
* Sodium Hydroxide
* Sodium Bicarbonate

### Group 2

* Electronic Configuration
* Trends
* Chemical Properties
* Uses

### Important Compounds

* Lime
* Limestone
* Calcium Oxide
* Calcium Carbonate

---

# Chapter 11: p-Block Elements (Group 13 & 14)

### Group 13

* Boron
* Aluminium
* Borax
* Boric Acid
* Boron Hydrides

### Group 14

* Carbon
* Silicon
* Allotropes
* Catenation
* Carbon Oxides
* Silicon Tetrachloride
* Silicones
* Silicates
* Zeolites

---

# Chapter 12: Organic Chemistry – Basic Principles

* Purification Methods
* Qualitative Analysis
* Quantitative Analysis
* IUPAC Nomenclature
* Inductive Effect
* Electromeric Effect
* Resonance
* Hyperconjugation
* Free Radicals
* Carbocations
* Carbanions
* Electrophiles
* Nucleophiles
* Organic Reaction Mechanism

---

# Chapter 13: Hydrocarbons

### Alkanes

* Nomenclature
* Isomerism
* Conformations
* Halogenation
* Combustion
* Pyrolysis

### Alkenes

* Double Bond
* Geometrical Isomerism
* Addition Reactions
* Markovnikov Rule
* Peroxide Effect
* Ozonolysis
* Oxidation

### Alkynes

* Triple Bond
* Acidic Character
* Addition Reactions

### Aromatic Hydrocarbons

* Benzene
* Aromaticity
* Resonance
* Nitration
* Sulphonation
* Halogenation
* Friedel Craft Reaction
* Directive Effects
* Toxicity

---

# Chapter 14: Environmental Chemistry

* Air Pollution
* Water Pollution
* Soil Pollution
* Smog
* Acid Rain
* Ozone Layer
* Ozone Depletion
* Greenhouse Effect
* Global Warming
* Industrial Pollution
* Green Chemistry
* Pollution Control

---

# 📘 Class 12 Chemistry

# Chapter 1: Solid State

* Types of Solids
* Crystalline Solids
* Amorphous Solids
* Unit Cell
* Packing
* Packing Efficiency
* Density of Unit Cell
* Voids
* Number of Atoms
* Point Defects
* Electrical Properties
* Magnetic Properties
* Band Theory
* Conductors
* Semiconductors
* Insulators
* n-Type Semiconductor
* p-Type Semiconductor

---

# Chapter 2: Solutions

* Types of Solutions
* Concentration Terms
* Solubility
* Raoult's Law
* Vapour Pressure
* Elevation of Boiling Point
* Depression of Freezing Point
* Osmotic Pressure
* Colligative Properties
* Van't Hoff Factor
* Abnormal Molecular Mass

---

# Chapter 3: Electrochemistry

* Conductance
* Conductivity
* Molar Conductivity
* Kohlrausch Law
* Electrolysis
* Faraday Laws
* Galvanic Cell
* Electrolytic Cell
* Lead Accumulator
* Dry Cell
* EMF
* Standard Electrode Potential
* Nernst Equation
* Gibbs Energy
* Fuel Cell
* Corrosion

---

# Chapter 4: Chemical Kinetics

* Rate of Reaction
* Average Rate
* Instantaneous Rate
* Order
* Molecularity
* Rate Law
* Rate Constant
* Integrated Rate Equation
* Half Life
* Collision Theory
* Activation Energy
* Arrhenius Equation

---

# Chapter 5: Surface Chemistry

* Adsorption
* Physisorption
* Chemisorption
* Catalysis
* Enzyme Catalysis
* Colloids
* Lyophilic Colloids
* Lyophobic Colloids
* Tyndall Effect
* Brownian Motion
* Electrophoresis
* Coagulation
* Emulsions

---

# Chapter 6: Isolation of Elements

* Metallurgy
* Concentration of Ore
* Calcination
* Roasting
* Reduction
* Electrolytic Reduction
* Refining
* Extraction of Aluminium
* Copper
* Zinc
* Iron

---

# Chapter 7: p-Block Elements (Group 15–18)

### Group 15

* Nitrogen
* Ammonia
* Nitric Acid
* Phosphorus
* Phosphine
* PCl₃
* PCl₅

### Group 16

* Oxygen
* Ozone
* Sulphur
* Sulphur Dioxide
* Sulphuric Acid

### Group 17

* Chlorine
* Hydrochloric Acid
* Interhalogen Compounds
* Oxoacids

### Group 18

* Noble Gases
* Properties
* Uses

---

# Chapter 8: d- and f-Block Elements

* Transition Elements
* Electronic Configuration
* Oxidation States
* Colour
* Magnetic Properties
* Catalytic Properties
* Alloy Formation
* K₂Cr₂O₇
* KMnO₄
* Lanthanoids
* Lanthanoid Contraction
* Actinoids

---

# Chapter 9: Coordination Compounds

* Ligands
* Coordination Number
* Nomenclature
* Werner Theory
* Valence Bond Theory
* Crystal Field Theory
* Isomerism
* Colour
* Magnetic Properties
* Biological Importance
* Metallurgical Importance

---

# Chapter 10: Haloalkanes and Haloarenes

### Haloalkanes

* Nomenclature
* C–X Bond
* SN1
* SN2
* Physical Properties
* Chemical Properties
* Optical Rotation

### Haloarenes

* C–X Bond
* Electrophilic Substitution
* Environmental Effects
* DDT
* Freons
* Chloroform
* Carbon Tetrachloride

---

# Chapter 11: Alcohols, Phenols and Ethers

### Alcohols

* Nomenclature
* Preparation
* Physical Properties
* Chemical Properties
* Dehydration
* Primary
* Secondary
* Tertiary Alcohols

### Phenols

* Acidity
* Electrophilic Substitution
* Uses

### Ethers

* Preparation
* Properties
* Uses

---

# Chapter 12: Aldehydes, Ketones and Carboxylic Acids

### Aldehydes

* Carbonyl Group
* Preparation
* Nucleophilic Addition
* Alpha Hydrogen

### Ketones

* Preparation
* Properties

### Carboxylic Acids

* Acidity
* Preparation
* Chemical Properties
* Uses

---

# Chapter 13: Organic Compounds Containing Nitrogen

* Amines
* Classification
* Preparation
* Physical Properties
* Chemical Properties
* Primary
* Secondary
* Tertiary Amines
* Diazonium Salts
* Cyanides
* Isocyanides

---

# Chapter 14: Biomolecules

### Carbohydrates

* Monosaccharides
* Disaccharides
* Polysaccharides

### Proteins

* Amino Acids
* Peptide Bond
* Protein Structure
* Denaturation
* Enzymes

### Hormones

### Vitamins

### Nucleic Acids

* DNA
* RNA

---

# Chapter 15: Polymers

* Classification
* Addition Polymerization
* Condensation Polymerization
* Copolymerization
* Natural Polymers
* Synthetic Polymers
* Biodegradable Polymers
* Non-Biodegradable Polymers

---

# Chapter 16: Chemistry in Everyday Life

### Drugs

* Analgesics
* Antibiotics
* Antiseptics
* Disinfectants
* Antacids
* Antihistamines
* Tranquilizers

### Food Chemistry

* Preservatives
* Artificial Sweeteners
* Antioxidants

### Cleansing Agents

* Soaps
* Detergents
* Cleansing Action
`;

function parseChemistry() {
  const lines = rawText.split('\\n');
  const parsed = {};
  let currentClass = null;
  let currentChapter = null;
  let currentTopic = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line.startsWith('---')) continue;

    if (line.startsWith('# 📘 Class')) {
      currentClass = line.replace('# 📘 ', '');
      parsed[currentClass] = [];
      currentChapter = null;
      currentTopic = null;
    } else if (line.startsWith('# Chapter')) {
      const chName = line.replace('# ', '');
      currentChapter = {
        id: 'c_' + hashString(chName),
        name: chName,
        description: 'Master the concepts of ' + chName,
        topics: []
      };
      if (currentClass) parsed[currentClass].push(currentChapter);
      currentTopic = null;
    } else if (line.startsWith('### ')) {
      const topicName = line.replace('### ', '');
      currentTopic = {
        id: 't_' + hashString(currentChapter.name + topicName),
        name: topicName,
        description: 'Learn about ' + topicName,
        subtopics: []
      };
      if (currentChapter) currentChapter.topics.push(currentTopic);
    } else if (line.startsWith('* ') || line.startsWith('- ')) {
      const subtopicName = line.replace('* ', '').replace('- ', '').trim();
      const subtopic = {
        id: 'st_' + hashString(currentChapter.name + (currentTopic ? currentTopic.name : 'gen') + subtopicName),
        name: subtopicName,
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
      };
      if (!currentTopic) {
        currentTopic = {
          id: 't_gen_' + currentChapter.id,
          name: 'General Concepts',
          description: 'General concepts',
          subtopics: []
        };
        if (currentChapter) currentChapter.topics.push(currentTopic);
      }
      currentTopic.subtopics.push(subtopic);
    }
  }
  return parsed;
}

const parsed = parseChemistry();
fs.writeFileSync('src/data/chemistryData.js', \`export const chemistryData = \${JSON.stringify(parsed, null, 2)};\\n\`);
console.log('Done');
