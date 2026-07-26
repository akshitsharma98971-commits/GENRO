const subjects = ["Mathematics", "Physics", "Chemistry", "Biology"];
const classes = ["Class 11", "Class 12"];
const boards = ["CBSE", "ICSE", "State Board"];

const rawPhysicsSyllabus = `
# 📘 Class 11 Physics

## Chapter 1: Physical World

### Scope of Physics
### Physics and Technology
### Fundamental Forces
### Nature of Physical Laws

---

## Chapter 2: Units and Measurements

### Physical Quantities
### SI System of Units
### Fundamental Units
### Derived Units
### Measurement of Length
### Measurement of Mass
### Measurement of Time
### Accuracy
### Precision
### Significant Figures
### Errors in Measurement
### Dimensions
### Dimensional Formulae
### Dimensional Analysis

---

## Chapter 3: Motion in a Straight Line

### Position
### Path Length
### Displacement
### Speed
### Velocity
### Average Velocity
### Instantaneous Velocity
### Acceleration
### Equations of Motion
### Motion Graphs

---

## Chapter 4: Motion in a Plane

### Scalars
### Vectors
### Vector Addition
### Resolution of Vectors
### Relative Velocity
### Projectile Motion
### Uniform Circular Motion

---

## Chapter 5: Laws of Motion

### Force
### Inertia
### Newton's First Law
### Newton's Second Law
### Newton's Third Law
### Momentum
### Impulse
### Friction
### Circular Motion Dynamics

---

## Chapter 6: Work, Energy and Power

### Work
### Kinetic Energy
### Work-Energy Theorem
### Potential Energy
### Conservation of Mechanical Energy
### Power
### Elastic Collision
### Inelastic Collision

---

## Chapter 7: System of Particles and Rotational Motion

### Centre of Mass
### Motion of Centre of Mass
### Linear Momentum
### Angular Displacement
### Angular Velocity
### Angular Acceleration
### Torque
### Angular Momentum
### Moment of Inertia
### Radius of Gyration
### Rotational Kinetic Energy
### Rolling Motion
### Equilibrium of Rigid Bodies

---

## Chapter 8: Gravitation

### Universal Law of Gravitation
### Gravitational Constant
### Gravitational Field
### Acceleration Due to Gravity
### Gravitational Potential
### Gravitational Potential Energy
### Escape Speed
### Orbital Motion
### Satellites

---

## Chapter 9: Mechanical Properties of Solids

### Elastic Behaviour
### Stress
### Strain
### Hooke's Law
### Young's Modulus
### Bulk Modulus
### Shear Modulus

---

## Chapter 10: Mechanical Properties of Fluids

### Pressure
### Fluid Pressure
### Pascal's Law
### Hydraulic Machines
### Buoyancy
### Archimedes' Principle
### Surface Tension
### Capillarity
### Viscosity
### Stokes' Law
### Bernoulli's Principle

---

## Chapter 11: Thermal Properties of Matter

### Temperature
### Heat
### Thermal Expansion
### Specific Heat Capacity
### Calorimetry
### Heat Transfer
### Conduction
### Convection
### Radiation
### Newton's Law of Cooling

---

## Chapter 12: Thermodynamics

### Thermal Equilibrium
### Thermodynamic System
### Internal Energy
### Heat
### Work
### First Law of Thermodynamics
### Thermodynamic Processes
### Second Law of Thermodynamics
### Heat Engine
### Refrigerator

---

## Chapter 13: Kinetic Theory

### Molecular Nature of Matter
### Ideal Gas
### Gas Laws
### Kinetic Theory of Gases
### Degrees of Freedom
### Law of Equipartition of Energy
### Mean Free Path

---

## Chapter 14: Oscillations

### Periodic Motion
### Oscillatory Motion
### Simple Harmonic Motion
### Displacement
### Velocity
### Acceleration
### Energy in SHM
### Damped Oscillations
### Forced Oscillations
### Resonance

---

## Chapter 15: Waves

### Wave Motion
### Mechanical Waves
### Longitudinal Waves
### Transverse Waves
### Wave Parameters
### Wave Speed
### Superposition Principle
### Standing Waves
### Beats
### Doppler Effect

---

# 📗 Class 12 Physics

## Chapter 1: Electric Charges and Fields

### Electric Charge
### Properties of Electric Charge
### Coulomb's Law
### Superposition Principle
### Electric Field
### Electric Field Lines
### Electric Dipole
### Dipole in External Electric Field
### Electric Flux
### Gauss's Law
### Applications of Gauss's Law

---

## Chapter 2: Electrostatic Potential and Capacitance

### Electrostatic Potential
### Potential Difference
### Equipotential Surfaces
### Potential Due to Point Charge
### Potential Due to Electric Dipole
### Potential Energy
### Conductors in Electrostatic Equilibrium
### Capacitor
### Capacitance
### Parallel Plate Capacitor
### Combination of Capacitors
### Energy Stored in Capacitor
### Dielectrics

---

## Chapter 3: Current Electricity

### Electric Current
### Electric Charge Flow
### Drift Velocity
### Mobility
### Ohm's Law
### Resistance
### Resistivity
### Conductivity
### Temperature Dependence of Resistance
### Electrical Energy
### Electrical Power
### EMF
### Internal Resistance
### Cells in Series and Parallel
### Kirchhoff's Laws
### Wheatstone Bridge
### Meter Bridge
### Potentiometer

---

## Chapter 4: Moving Charges and Magnetism

### Magnetic Force
### Lorentz Force
### Motion in Magnetic Field
### Cyclotron
### Biot-Savart Law
### Ampere's Circuital Law
### Magnetic Field Due to Current
### Solenoid
### Toroid
### Force Between Parallel Conductors
### Torque on Current Loop
### Moving Coil Galvanometer
### Ammeter
### Voltmeter

---

## Chapter 5: Magnetism and Matter

### Bar Magnet
### Magnetic Field Lines
### Magnetic Dipole
### Earth's Magnetism
### Magnetic Elements
### Magnetisation
### Magnetic Intensity
### Magnetic Susceptibility
### Magnetic Permeability
### Diamagnetic Materials
### Paramagnetic Materials
### Ferromagnetic Materials

---

## Chapter 6: Electromagnetic Induction

### Electromagnetic Induction
### Magnetic Flux
### Faraday's Laws
### Lenz's Law
### Motional EMF
### Eddy Currents
### Self Inductance
### Mutual Inductance

---

## Chapter 7: Alternating Current

### Alternating Current
### Alternating Voltage
### RMS Value
### AC Circuit
### Phasor Diagram
### Resistance in AC Circuit
### Inductance
### Capacitance
### Reactance
### Impedance
### Series LCR Circuit
### Resonance
### Power in AC Circuit
### Transformer

---

## Chapter 8: Electromagnetic Waves

### Displacement Current
### Electromagnetic Waves
### Properties of Electromagnetic Waves
### Electromagnetic Spectrum
### Applications of Electromagnetic Waves

---

## Chapter 9: Ray Optics and Optical Instruments

### Reflection of Light
### Reflection at Spherical Surfaces
### Spherical Mirrors
### Mirror Formula
### Refraction of Light
### Refraction at Plane Surface
### Refraction at Spherical Surface
### Total Internal Reflection
### Optical Fibres
### Lenses
### Lens Formula
### Power of Lens
### Lens Combination
### Refraction Through Prism
### Microscope
### Astronomical Telescope

---

## Chapter 10: Wave Optics

### Wave Nature of Light
### Huygens' Principle
### Wavefront
### Interference
### Young's Double Slit Experiment
### Diffraction
### Polarisation

---

## Chapter 11: Dual Nature of Radiation and Matter

### Photoelectric Effect
### Hertz Experiment
### Einstein's Photoelectric Equation
### Photon
### Matter Waves
### de Broglie Hypothesis
### Davisson-Germer Experiment

---

## Chapter 12: Atoms

### Atomic Models
### Thomson Model
### Rutherford Model
### Bohr Model
### Hydrogen Spectrum
### Energy Levels
### Atomic Excitation
### Atomic De-excitation

---

## Chapter 13: Nuclei

### Atomic Nucleus
### Nuclear Composition
### Nuclear Size
### Nuclear Density
### Mass Defect
### Binding Energy
### Nuclear Stability
### Radioactivity
### Radioactive Decay Law
### Half-life
### Mean Life
### Nuclear Fission
### Nuclear Fusion

---

## Chapter 14: Semiconductor Electronics: Materials, Devices and Simple Circuits

### Semiconductor Materials
### Intrinsic Semiconductors
### Extrinsic Semiconductors
### p-Type Semiconductor
### n-Type Semiconductor
### p-n Junction
### Semiconductor Diode
### Rectifier
### Zener Diode
### Light Emitting Diode
### Photodiode
### Solar Cell
### Junction Transistor
### Transistor Configurations
### Logic Gates
### Digital Circuits
`;

const rawChemistrySyllabus = `
# 📘 Class 11 Chemistry

## Chapter 1: Some Basic Concepts of Chemistry
### Matter
### Classification of Matter
### Physical and Chemical Properties
### Laws of Chemical Combination
### Atomic Mass
### Molecular Mass
### Mole Concept
### Stoichiometry
### Limiting Reagent
### Concentration Terms

---

## Chapter 2: Structure of Atom
### Atomic Models
### Electromagnetic Radiation
### Photoelectric Effect
### Atomic Spectrum
### Bohr Model
### Quantum Mechanical Model
### Dual Nature of Matter
### Heisenberg Uncertainty Principle
### Quantum Numbers
### Atomic Orbitals
### Electronic Configuration
### Aufbau Principle
### Pauli Exclusion Principle
### Hund's Rule

---

## Chapter 3: Classification of Elements and Periodicity in Properties
### Modern Periodic Law
### Modern Periodic Table
### Electronic Configuration
### Atomic Radius
### Ionic Radius
### Ionization Enthalpy
### Electron Gain Enthalpy
### Electronegativity
### Valency
### Periodic Trends

---

## Chapter 4: Chemical Bonding and Molecular Structure
### Chemical Bonding
### Octet Rule
### Lewis Structures
### Ionic Bond
### Covalent Bond
### Coordinate Bond
### Bond Parameters
### Valence Bond Theory
### Hybridization
### Molecular Orbital Theory
### Hydrogen Bonding
### VSEPR Theory
### Molecular Geometry

---

## Chapter 5: Thermodynamics
### Thermodynamic System
### Surroundings
### State Functions
### Internal Energy
### Heat
### Work
### Enthalpy
### Heat Capacity
### Hess's Law
### Enthalpy Change
### Entropy
### Gibbs Energy
### Spontaneity

---

## Chapter 6: Equilibrium
### Dynamic Equilibrium
### Law of Mass Action
### Equilibrium Constant
### Le Chatelier's Principle
### Chemical Equilibrium
### Ionic Equilibrium
### Acids
### Bases
### pH
### Buffer Solutions
### Solubility Product
### Common Ion Effect

---

## Chapter 7: Redox Reactions
### Oxidation
### Reduction
### Oxidation Number
### Oxidising Agent
### Reducing Agent
### Balancing Redox Reactions
### Redox Titration
### Applications of Redox Reactions

---

## Chapter 8: Organic Chemistry – Some Basic Principles and Techniques
### Organic Compounds
### Classification of Organic Compounds
### IUPAC Nomenclature
### Structural Isomerism
### Electronic Effects
### Reaction Intermediates
### Organic Reaction Mechanisms
### Purification Techniques
### Qualitative Analysis
### Quantitative Analysis

---

## Chapter 9: Hydrocarbons
### Classification of Hydrocarbons
### Alkanes
### Alkenes
### Alkynes
### Aromatic Hydrocarbons
### Preparation of Hydrocarbons
### Physical Properties
### Chemical Properties
### Hydrocarbon Reactions
### Aromaticity

---

# 📘 Class 12 Chemistry

## Chapter 1: Solutions
### Types of Solutions
### Concentration of Solutions
### Solubility
### Vapour Pressure
### Raoult's Law
### Ideal Solutions
### Non-Ideal Solutions
### Azeotropes
### Colligative Properties
### Relative Lowering of Vapour Pressure
### Elevation of Boiling Point
### Depression of Freezing Point
### Osmotic Pressure
### Abnormal Molar Mass
### Van't Hoff Factor

---

## Chapter 2: Electrochemistry
### Electrochemical Cells
### Galvanic Cells
### Electrode Potential
### Standard Electrode Potential
### Nernst Equation
### Cell Potential
### Gibbs Energy and Cell Potential
### Conductance
### Conductivity
### Molar Conductivity
### Kohlrausch's Law
### Electrolysis
### Batteries
### Fuel Cells
### Corrosion

---

## Chapter 3: Chemical Kinetics
### Rate of Reaction
### Rate Law
### Rate Constant
### Order of Reaction
### Molecularity
### Integrated Rate Equations
### Half-Life
### Temperature Dependence of Rate
### Arrhenius Equation
### Activation Energy
### Collision Theory
### Catalysis

---

## Chapter 4: d- and f-Block Elements
### Transition Elements
### Electronic Configuration
### General Characteristics
### Oxidation States
### Atomic and Ionic Radii
### Magnetic Properties
### Coloured Ions
### Catalytic Properties
### Interstitial Compounds
### Alloy Formation
### Lanthanoids
### Lanthanoid Contraction
### Actinoids

---

## Chapter 5: Coordination Compounds
### Coordination Compounds
### Coordination Entities
### Ligands
### Coordination Number
### Nomenclature
### Isomerism
### Werner's Theory
### Valence Bond Theory
### Crystal Field Theory
### Bonding in Coordination Compounds
### Stability of Coordination Compounds
### Applications of Coordination Compounds

---

## Chapter 6: Haloalkanes and Haloarenes
### Classification
### Nomenclature
### Nature of Carbon-Halogen Bond
### Preparation
### Physical Properties
### Chemical Properties
### Nucleophilic Substitution Reactions
### Elimination Reactions
### Haloarenes
### Polyhalogen Compounds

---

## Chapter 7: Alcohols, Phenols and Ethers
### Classification
### Nomenclature
### Alcohols
### Phenols
### Ethers
### Preparation
### Physical Properties
### Chemical Properties
### Acidity of Phenols
### Reactions of Alcohols
### Reactions of Phenols
### Reactions of Ethers

---

## Chapter 8: Aldehydes, Ketones and Carboxylic Acids
### Classification
### Nomenclature
### Aldehydes
### Ketones
### Carboxylic Acids
### Preparation
### Physical Properties
### Chemical Properties
### Nucleophilic Addition Reactions
### Oxidation Reactions
### Reduction Reactions
### Decarboxylation

---

## Chapter 9: Amines
### Classification
### Nomenclature
### Preparation
### Physical Properties
### Chemical Properties
### Basic Character
### Diazonium Salts
### Diazonium Reactions

---

## Chapter 10: Biomolecules
### Biomolecules
### Carbohydrates
### Monosaccharides
### Disaccharides
### Polysaccharides
### Proteins
### Amino Acids
### Peptides
### Protein Structure
### Enzymes
### Vitamins
### Nucleic Acids
### DNA
### RNA
`;

const rawBiologySyllabus = `
# 🌿 Class 11 Biology

## Chapter 1: The Living World
### Characteristics of Living Organisms
### Biodiversity
### Taxonomy
### Systematics
### Binomial Nomenclature
### Taxonomic Categories
### Taxonomic Hierarchy

---

## Chapter 2: Biological Classification
### Kingdom Classification
### Five Kingdom System
### Monera
### Protista
### Fungi
### Viruses
### Viroids
### Lichens

---

## Chapter 3: Plant Kingdom
### Algae
### Bryophytes
### Pteridophytes
### Gymnosperms

---

## Chapter 4: Animal Kingdom
### Basis of Classification
### Levels of Organisation
### Symmetry
### Germ Layers
### Body Cavity
### Segmentation
### Notochord
### Non-Chordates
### Chordates

---

## Chapter 5: Morphology of Flowering Plants
### Root
### Stem
### Leaf
### Inflorescence
### Flower
### Fruit
### Seed
### Floral Formula
### Floral Diagram

---

## Chapter 6: Anatomy of Flowering Plants
### Tissue System
### Epidermal Tissue System
### Ground Tissue System
### Vascular Tissue System
### Internal Structure of Root
### Internal Structure of Stem
### Internal Structure of Leaf

---

## Chapter 7: Structural Organisation in Animals
### Frog

---

## Chapter 8: Cell: The Unit of Life
### Cell Theory
### Prokaryotic Cell
### Eukaryotic Cell
### Cell Envelope
### Cell Membrane
### Cell Wall
### Cell Organelles
### Nucleus
### Cytoskeleton
### Cilia
### Flagella

---

## Chapter 9: Biomolecules
### Biomolecules
### Primary Metabolites
### Secondary Metabolites
### Carbohydrates
### Proteins
### Lipids
### Nucleic Acids
### Enzymes

---

## Chapter 10: Cell Cycle and Cell Division
### Cell Cycle
### Interphase
### Mitosis
### Meiosis
### Significance of Cell Division

---

## Chapter 11: Photosynthesis in Higher Plants
### Photosynthetic Pigments
### Photosystems
### Light Reaction
### Photophosphorylation
### Carbon Fixation
### C3 Pathway
### C4 Pathway
### Photorespiration
### Factors Affecting Photosynthesis

---

## Chapter 12: Respiration in Plants
### Cellular Respiration
### Glycolysis
### Krebs Cycle
### Electron Transport System
### Oxidative Phosphorylation
### Fermentation
### Respiratory Quotient

---

## Chapter 13: Plant Growth and Development
### Plant Growth
### Growth Phases
### Growth Rate
### Plant Growth Regulators
### Auxins
### Gibberellins
### Cytokinins
### Abscisic Acid
### Ethylene

---

## Chapter 14: Breathing and Exchange of Gases
### Respiratory Organs
### Human Respiratory System
### Mechanism of Breathing
### Pulmonary Ventilation
### Gas Exchange
### Transport of Gases
### Regulation of Respiration
### Respiratory Disorders

---

## Chapter 15: Body Fluids and Circulation
### Blood
### Lymph
### Blood Groups
### Human Heart
### Cardiac Cycle
### Electrocardiography
### Double Circulation
### Circulatory Disorders

---

## Chapter 16: Excretory Products and Their Elimination
### Excretion
### Human Excretory System
### Nephron
### Urine Formation
### Regulation of Kidney Function
### Micturition
### Dialysis
### Excretory Disorders

---

## Chapter 17: Locomotion and Movement
### Types of Movement
### Skeletal System
### Joints
### Muscular System
### Muscle Contraction
### Locomotory Disorders

---

## Chapter 18: Neural Control and Coordination
### Nervous System
### Neuron
### Central Nervous System
### Peripheral Nervous System
### Autonomic Nervous System
### Synapse

---

## Chapter 19: Chemical Coordination and Integration
### Endocrine System
### Hormones
### Hypothalamus
### Pituitary Gland
### Thyroid Gland
### Parathyroid Gland
### Adrenal Gland
### Pancreas
### Pineal Gland
### Gonads
### Hormonal Disorders

---

# 🌱 Class 12 Biology

## Chapter 1: Sexual Reproduction in Flowering Plants
### Flower Structure
### Pre-fertilisation Events
### Microsporogenesis
### Megasporogenesis
### Pollination
### Double Fertilisation
### Post-fertilisation Events
### Endosperm Development
### Embryo Development
### Seed Formation
### Fruit Formation
### Apomixis
### Polyembryony

---

## Chapter 2: Human Reproduction
### Male Reproductive System
### Female Reproductive System
### Gametogenesis
### Menstrual Cycle
### Fertilisation
### Cleavage
### Blastocyst Formation
### Implantation
### Pregnancy
### Embryonic Development
### Parturition
### Lactation

---

## Chapter 3: Reproductive Health
### Reproductive Health
### Population Explosion
### Birth Control
### Contraceptive Methods
### Medical Termination of Pregnancy
### Sexually Transmitted Infections
### Infertility
### Assisted Reproductive Technologies

---

## Chapter 4: Principles of Inheritance and Variation
### Mendelian Genetics
### Monohybrid Cross
### Dihybrid Cross
### Laws of Inheritance
### Incomplete Dominance
### Codominance
### Multiple Alleles
### Blood Groups
### Pleiotropy
### Chromosomal Theory of Inheritance
### Linkage
### Crossing Over
### Sex Determination
### Genetic Disorders
### Pedigree Analysis

---

## Chapter 5: Molecular Basis of Inheritance
### DNA
### RNA
### DNA Structure
### DNA Replication
### Transcription
### Genetic Code
### Translation
### Gene Expression
### Lac Operon
### Human Genome Project
### DNA Fingerprinting

---

## Chapter 6: Evolution
### Origin of Life
### Evolutionary Theories
### Evidences of Evolution
### Adaptive Radiation
### Biological Evolution
### Natural Selection
### Hardy-Weinberg Principle
### Genetic Drift
### Speciation
### Human Evolution

---

## Chapter 7: Human Health and Disease
### Human Health
### Pathogens
### Immunity
### Immune System
### Vaccination
### Allergy
### Autoimmunity
### AIDS
### Cancer
### Drug and Alcohol Abuse

---

## Chapter 8: Microbes in Human Welfare
### Microbes in Household Products
### Microbes in Industrial Products
### Sewage Treatment
### Biogas Production
### Biocontrol Agents
### Biofertilisers

---

## Chapter 9: Biotechnology: Principles and Processes
### Biotechnology
### Genetic Engineering
### Recombinant DNA Technology
### Restriction Enzymes
### DNA Ligase
### Cloning Vectors
### Competent Host
### Polymerase Chain Reaction
### Gene Cloning
### Downstream Processing

---

## Chapter 10: Biotechnology and Its Applications
### Biotechnology in Agriculture
### Genetically Modified Crops
### Pest Resistant Crops
### Biotechnology in Medicine
### Recombinant Therapeutics
### Gene Therapy
### Molecular Diagnosis
### ELISA
### Transgenic Animals
### Biopatents
### Biosafety
### Bioethics
`;

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

function parseSyllabusText(text) {
  const lines = text.split('\n');
  const parsed = {
    "Class 11": [],
    "Class 12": []
  };
  let currentClass = null;
  let currentChapter = null;
  let currentTopic = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line.startsWith('---')) continue;

    if (line.includes('Class 11')) {
      currentClass = 'Class 11';
      currentChapter = null;
      currentTopic = null;
    } else if (line.includes('Class 12')) {
      currentClass = 'Class 12';
      currentChapter = null;
      currentTopic = null;
    } else if (line.match(/^#+\s*Chapter/)) {
      if (!currentClass) currentClass = 'Class 11';
      const chName = line.replace(/^#+\s*/, '').trim();
      currentChapter = {
        id: 'c_' + hashString(chName),
        name: chName,
        description: 'Master the concepts of ' + chName,
        topics: []
      };
      if (currentClass) parsed[currentClass].push(currentChapter);
      currentTopic = null;
    } else if (line.match(/^###\s+/)) {
      const topicName = line.replace(/^###\s+/, '').trim();
      currentTopic = {
        id: 't_' + hashString(currentChapter ? currentChapter.name + topicName : topicName),
        name: topicName,
        description: 'Learn about ' + topicName,
        subtopics: []
      };
      if (currentChapter) currentChapter.topics.push(currentTopic);
    } else if (line.startsWith('* ') || line.startsWith('- ')) {
      const subtopicName = line.replace(/^[\*\-]\s+/, '').trim();
      const subtopic = {
        id: 'st_' + hashString((currentChapter ? currentChapter.name : '') + (currentTopic ? currentTopic.name : 'gen') + subtopicName),
        name: subtopicName,
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
      };
      if (!currentTopic) {
        currentTopic = {
          id: 't_gen_' + (currentChapter ? currentChapter.id : 'default'),
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

const parsedPhysics = parseSyllabusText(rawPhysicsSyllabus);
const parsedChemistry = parseSyllabusText(rawChemistrySyllabus);
const parsedBiology = parseSyllabusText(rawBiologySyllabus);

export const mockCurriculum = {};

classes.forEach(cls => {
  mockCurriculum[cls] = {};
  boards.forEach(board => {
    mockCurriculum[cls][board] = {};
    
    // Set dummy data for other subjects
    ["Mathematics"].forEach(subject => {
      mockCurriculum[cls][board][subject] = [
        {
          id: `dummy-${subject}-ch1`,
          name: `${subject} - Coming Soon`,
          description: `Detailed syllabus for ${subject} will be added soon.`,
          topics: []
        }
      ];
    });

    if (parsedPhysics[cls]) {
      mockCurriculum[cls][board]["Physics"] = parsedPhysics[cls];
    } else {
      mockCurriculum[cls][board]["Physics"] = [];
    }
    
    if (parsedChemistry[cls]) {
      mockCurriculum[cls][board]["Chemistry"] = parsedChemistry[cls];
    } else {
      mockCurriculum[cls][board]["Chemistry"] = [];
    }

    if (parsedBiology[cls]) {
      mockCurriculum[cls][board]["Biology"] = parsedBiology[cls];
    } else {
      mockCurriculum[cls][board]["Biology"] = [];
    }
  });
});
