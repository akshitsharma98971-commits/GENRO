import fs from 'fs';
import crypto from 'crypto';

const rawData = `
# 📘 Class 11 Physics

## Chapter 1: Physical World and Measurement

### 1. Physical World

* Physics kya hai?
* Scope of Physics
* Nature of Physical Laws
* Physics, Technology and Society

### 2. Units and Measurements

* Need of Measurement
* Systems of Units
* SI Units
* Fundamental Quantities
* Derived Quantities
* Length Measurement
* Mass Measurement
* Time Measurement
* Accuracy
* Precision
* Types of Errors
* Error Calculation
* Significant Figures

### 3. Dimensional Analysis

* Dimensions of Physical Quantities
* Dimensional Formula
* Applications of Dimensional Analysis
* Checking Correctness of Equations
* Unit Conversion

---

# Chapter 2: Kinematics

### Motion in One Dimension

* Frame of Reference
* Position
* Distance
* Displacement
* Speed
* Average Speed
* Instantaneous Speed
* Velocity
* Average Velocity
* Instantaneous Velocity
* Uniform Motion
* Non-uniform Motion
* Acceleration
* Uniform Acceleration
* Equations of Motion
* Position-Time Graph
* Velocity-Time Graph
* Acceleration-Time Graph

### Calculus in Motion

* Basic Differentiation
* Basic Integration

### Vectors

* Scalar Quantities
* Vector Quantities
* Position Vector
* Displacement Vector
* Unit Vector
* Addition of Vectors
* Subtraction of Vectors
* Multiplication by Scalar
* Resolution of Vectors
* Rectangular Components
* Relative Velocity
* Dot Product
* Cross Product

### Motion in Plane

* Projectile Motion
* Projectile Equations
* Time of Flight
* Maximum Height
* Horizontal Range
* Uniform Circular Motion

---

# Chapter 3: Laws of Motion

### Newton's Laws

* Force
* Inertia
* Newton's First Law
* Momentum
* Newton's Second Law
* Impulse
* Newton's Third Law

### Conservation Laws

* Conservation of Linear Momentum
* Applications

### Friction

* Static Friction
* Kinetic Friction
* Rolling Friction
* Laws of Friction
* Lubrication

### Circular Motion

* Centripetal Force
* Vehicle on Level Road
* Vehicle on Banked Road

---

# Chapter 4: Work, Energy and Power

### Work and Energy

* Work Done
* Variable Force
* Kinetic Energy
* Work Energy Theorem
* Power
* Potential Energy
* Spring Potential Energy
* Conservative Force
* Non-Conservative Force
* Conservation of Mechanical Energy

### Collision

* Vertical Circular Motion
* Elastic Collision
* Inelastic Collision
* One-Dimensional Collision
* Two-Dimensional Collision

---

# Chapter 5: System of Particles and Rotational Motion

### Centre of Mass

* Centre of Mass
* Motion of Centre of Mass

### Rotational Motion

* Torque
* Moment of Force
* Angular Momentum
* Conservation of Angular Momentum
* Equilibrium
* Rigid Body Rotation
* Rotational Equations
* Linear vs Rotational Motion

### Moment of Inertia

* Radius of Gyration
* M.I. of Standard Bodies
* Parallel Axis Theorem
* Perpendicular Axis Theorem

---

# Chapter 6: Gravitation

### Gravitation Basics

* Kepler's Laws
* Universal Law of Gravitation
* Acceleration due to Gravity
* Variation of g with Height
* Variation of g with Depth
* Gravitational Potential
* Gravitational Potential Energy

### Satellites

* Escape Velocity
* Orbital Velocity
* Satellites
* Geostationary Satellite

---

# Chapter 7: Properties of Bulk Matter

### Elasticity

* Stress
* Strain
* Hooke's Law
* Young's Modulus
* Bulk Modulus
* Shear Modulus
* Poisson Ratio
* Elastic Energy

### Fluid Mechanics

* Pressure
* Pascal's Law
* Hydraulic Lift
* Hydraulic Brake
* Fluid Pressure

### Viscosity

* Stokes Law
* Terminal Velocity
* Reynolds Number
* Streamline Flow
* Turbulent Flow
* Bernoulli's Theorem

### Surface Tension

* Surface Energy
* Surface Tension
* Angle of Contact
* Excess Pressure
* Capillary Rise
* Soap Bubble

### Thermal Properties

* Heat
* Temperature
* Thermal Expansion
* Expansion of Solids
* Liquids
* Gases
* Anomalous Expansion of Water
* Specific Heat
* Latent Heat

### Heat Transfer

* Conduction
* Thermal Conductivity
* Convection
* Radiation
* Black Body Radiation
* Wien's Law
* Greenhouse Effect
* Newton's Cooling Law
* Stefan's Law

---

# Chapter 8: Thermodynamics

### Laws of Thermodynamics

* Thermal Equilibrium
* Zeroth Law
* Internal Energy
* Heat
* Work
* First Law
* Isothermal Process
* Adiabatic Process
* Second Law
* Reversible Process
* Irreversible Process

### Engines

* Heat Engine
* Refrigerator

---

# Chapter 9: Kinetic Theory

### Kinetic Theory of Gases

* Ideal Gas Equation
* Gas Compression
* Assumptions of Kinetic Theory
* Pressure of Gas
* Kinetic Energy
* RMS Speed
* Degrees of Freedom
* Equipartition Theorem
* Mean Free Path
* Avogadro Number

---

# Chapter 10: Oscillations and Waves

### Oscillations

* Periodic Motion
* Time Period
* Frequency
* SHM
* Equation of SHM
* Phase
* Spring Oscillation
* Energy in SHM
* Simple Pendulum
* Free Oscillation
* Forced Oscillation
* Damped Oscillation
* Resonance

### Waves

* Wave Motion
* Longitudinal Wave
* Transverse Wave
* Wave Speed
* Progressive Wave
* Superposition Principle
* Reflection of Waves
* Standing Waves
* Organ Pipe
* Harmonics
* Beats
* Doppler Effect

---

# 📗 Class 12 Physics

## Chapter 1: Electrostatics

### Electric Charge and Field

* Electric Charge
* Conservation of Charge
* Coulomb's Law
* Superposition Principle
* Continuous Charge Distribution
* Electric Field
* Electric Field Lines
* Electric Dipole
* Electric Flux

### Gauss Law and Potential

* Gauss's Law
* Applications of Gauss Law
* Electric Potential
* Potential Difference
* Equipotential Surface
* Potential Energy

### Capacitors

* Conductors
* Insulators
* Dielectrics
* Polarisation
* Capacitor
* Capacitance
* Series Combination
* Parallel Combination
* Parallel Plate Capacitor
* Energy Stored
* Van de Graaff Generator

---

## Chapter 2: Current Electricity

### Electric Current

* Electric Current
* Drift Velocity
* Mobility
* Ohm's Law
* Resistance
* Resistivity
* Conductivity
* Electrical Energy
* Electrical Power
* Carbon Resistor
* Colour Code

### Circuits

* Series Resistance
* Parallel Resistance
* Internal Resistance
* EMF
* Cells in Series
* Cells in Parallel
* Kirchhoff's Laws
* Wheatstone Bridge
* Meter Bridge
* Potentiometer
* Comparison of EMF
* Internal Resistance Measurement

---

## Chapter 3: Magnetic Effects of Current and Magnetism

### Magnetic Fields

* Magnetic Field
* Oersted Experiment
* Biot-Savart Law
* Ampere's Circuital Law
* Solenoid
* Toroid
* Lorentz Force
* Cyclotron
* Force on Current Carrying Conductor
* Force Between Parallel Conductors
* Moving Coil Galvanometer
* Ammeter
* Voltmeter

### Magnetism and Matter

* Magnetic Dipole
* Magnetic Moment
* Earth's Magnetism
* Para Magnetism
* Dia Magnetism
* Ferro Magnetism
* Electromagnets
* Permanent Magnets

---

## Chapter 4: Electromagnetic Induction and AC

### Electromagnetic Induction

* Electromagnetic Induction
* Faraday's Law
* Lenz Law
* Eddy Current
* Self Inductance
* Mutual Inductance

### Alternating Current

* Alternating Current
* Peak Value
* RMS Value
* Reactance
* Impedance
* LC Oscillation
* LCR Circuit
* Resonance
* Power in AC
* AC Generator
* Transformer

---

## Chapter 5: Electromagnetic Waves

### EM Waves

* Displacement Current
* Electromagnetic Waves
* Characteristics
* Transverse Nature

### EM Spectrum

* Electromagnetic Spectrum
* Radio Waves
* Microwaves
* Infrared
* Visible Light
* Ultraviolet
* X-rays
* Gamma Rays
* Uses of Electromagnetic Waves

---

## Chapter 6: Ray Optics & Wave Optics

### Ray Optics

* Reflection
* Spherical Mirror
* Mirror Formula
* Refraction
* Total Internal Reflection
* Optical Fibre
* Refraction at Spherical Surface
* Thin Lens Formula
* Lens Maker Formula
* Magnification
* Power of Lens
* Lens Combination
* Prism
* Dispersion
* Scattering
* Human Eye
* Eye Defects
* Myopia
* Hypermetropia
* Microscope
* Astronomical Telescope

### Wave Optics

* Wavefront
* Huygens Principle
* Reflection
* Refraction
* Interference
* Young's Double Slit Experiment
* Fringe Width
* Coherent Sources
* Diffraction
* Polarisation
* Brewster Law
* Polaroids
* Resolving Power

---

## Chapter 7: Dual Nature of Matter and Radiation

### Dual Nature

* Photoelectric Effect
* Hertz Experiment
* Lenard Experiment
* Einstein Photoelectric Equation
* Matter Waves
* de Broglie Hypothesis
* Davisson-Germer Experiment

---

## Chapter 8: Atoms and Nuclei

### Atoms

* Rutherford Model
* Alpha Scattering Experiment
* Bohr Model
* Hydrogen Spectrum
* Energy Levels

### Nuclei

* Atomic Mass
* Isotopes
* Isobars
* Isotones
* Radioactivity
* Alpha Decay
* Beta Decay
* Gamma Decay
* Radioactive Decay Law
* Mass Defect
* Binding Energy
* Nuclear Fission
* Nuclear Fusion

---

## Chapter 9: Semiconductor Electronics

### Semiconductors and Diodes

* Energy Bands
* Conductors
* Insulators
* Semiconductors
* PN Junction
* Diode
* Rectifier
* LED
* Photodiode
* Solar Cell
* Zener Diode
* Voltage Regulator

### Transistors and Logic Gates

* Junction Transistor
* Amplifier
* Oscillator
* Logic Gates (AND, OR, NOT, NAND, NOR)
* Transistor as Switch

---

## Chapter 10: Communication Systems

### Communication Basics

* Communication System
* Block Diagram
* Bandwidth
* Transmission Medium

### Wave Propagation and Modulation

* Wave Propagation
* Sky Wave
* Space Wave
* Modulation
* Amplitude Modulation
* Detection of AM Wave
`;

const physicsData = {
    "Class 11": [],
    "Class 12": []
};

let currentClass = null;
let currentChapter = null;
let currentTopic = null;

function makeId(text) {
    return crypto.createHash('md5').update(text).digest('hex').substring(0, 8);
}

const lines = rawData.trim().split("\\n");
for (let line of lines) {
    line = line.trim();
    if (!line || line === "---") continue;
    
    if (line.startsWith("# 📘 Class 11 Physics") || line.startsWith("# Class 11 Physics")) {
        currentClass = "Class 11";
    } else if (line.startsWith("# 📗 Class 12 Physics") || line.startsWith("# Class 12 Physics")) {
        currentClass = "Class 12";
    } else if (line.startsWith("## Chapter") || (line.startsWith("# Chapter") && !line.includes("Physics"))) {
        if (!currentClass) currentClass = "Class 11";
        let chName = line.replace(/^#+\\s*/, "").trim();
        currentChapter = {
            id: "c_" + makeId(chName),
            name: chName,
            description: "Master the concepts of " + chName,
            topics: []
        };
        physicsData[currentClass].push(currentChapter);
        currentTopic = null;
    } else if (line.startsWith("### ")) {
        let topicName = line.replace(/^#+\\s*/, "").trim();
        currentTopic = {
            id: "t_" + makeId(topicName),
            name: topicName,
            description: "Learn about " + topicName,
            subtopics: []
        };
        if (currentChapter) {
            currentChapter.topics.push(currentTopic);
        }
    } else if (line.startsWith("* ")) {
        let subName = line.replace(/^\\*\\s*/, "").trim();
        let subtopic = {
            id: "s_" + makeId(subName),
            name: subName,
            videoUrl: "simulated://video/" + makeId(subName),
            testSize: "dynamic"
        };
        
        if (!currentTopic) {
            currentTopic = {
                id: "t_general_" + currentChapter.id,
                name: "General Concepts",
                description: "General concepts",
                subtopics: []
            };
            if (currentChapter) {
                currentChapter.topics.push(currentTopic);
            }
        }
        currentTopic.subtopics.push(subtopic);
    }
}

fs.writeFileSync("physicsCurriculum.js", "export const physicsData = " + JSON.stringify(physicsData, null, 2) + ";\n", "utf-8");
console.log("Created src/data/physicsCurriculum.js");
