import React, { useState, useRef, forwardRef } from 'react';

/**
 * Individual card that fans out of the folder on hover.
 */
const FolderCard = forwardRef(function FolderCard(
  { image, label, delay, isVisible, index, totalCount, onClick },
  ref
) {
  const middleIndex = (totalCount - 1) / 2;
  const factor = totalCount > 1 ? (index - middleIndex) / middleIndex : 0;

  const rotation    = factor * 20;
  const translateX  = factor * 62;
  const translateY  = Math.abs(factor) * 8;

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        width: '58px',
        height: '80px',
        left: '-29px',
        top: '-40px',
        zIndex: 10 + index,
        transform: isVisible
          ? `translateY(calc(-76px + ${translateY}px)) translateX(${translateX}px) rotate(${rotation}deg) scale(1)`
          : 'translateY(0) translateX(0) rotate(0deg) scale(0.4)',
        opacity: isVisible ? 1 : 0,
        transition: `transform 700ms cubic-bezier(0.16,1,0.3,1) ${delay}ms, opacity 600ms ease ${delay}ms`,
        cursor: 'pointer',
      }}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className="group/card"
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '10px',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          transition: 'transform 400ms cubic-bezier(0.16,1,0.3,1), box-shadow 400ms ease',
          position: 'relative',
        }}
        className="group-hover/card:-translate-y-5 group-hover/card:scale-125 group-hover/card:shadow-2xl"
      >
        <img
          src={image}
          alt={label}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', userSelect: 'none' }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)',
          }}
        />
        <p
          style={{
            position: 'absolute',
            bottom: '5px',
            left: '5px',
            right: '5px',
            fontSize: '8px',
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            color: '#fff',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
          }}
        >
          {label}
        </p>
      </div>
    </div>
  );
});

/**
 * AnimatedFolder — 3D folder card with fanning previews on hover.
 *
 * Props:
 *  title      — Folder label
 *  subtitle   — Short description line
 *  icon       — React node (icon)
 *  accentColor — e.g. '#a855f7'
 *  gradient   — CSS gradient string for folder body
 *  previews   — Array of { id, image, label }
 *  onClick    — Called when folder body or title is clicked
 */
export default function AnimatedFolder({
  title,
  subtitle,
  icon,
  accentColor = '#a855f7',
  gradient,
  previews = [],
  onClick,
}) {
  const [hovered, setHovered] = useState(false);
  const cardRefs = useRef([]);

  const backGrad  = gradient || `linear-gradient(135deg, ${accentColor}cc 0%, ${accentColor}88 100%)`;
  const frontGrad = gradient || `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}bb 100%)`;
  const tabColor  = gradient || accentColor + 'dd';

  const displayPreviews = previews.slice(0, 5);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '20px 18px 18px',
        borderRadius: '24px',
        cursor: 'pointer',
        border: `1px solid ${hovered ? accentColor + '60' : 'rgba(255,255,255,0.08)'}`,
        /* Glassmorphism */
        background: hovered
          ? `radial-gradient(ellipse at 50% 85%, ${accentColor}22 0%, transparent 65%), rgba(255,255,255,0.04)`
          : 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        transform: hovered ? 'scale(1.04) rotate(-1.5deg)' : 'scale(1) rotate(0deg)',
        boxShadow: hovered
          ? `0 16px 48px -8px ${accentColor}35, 0 2px 12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)`
          : '0 2px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
        transition: 'all 600ms cubic-bezier(0.16,1,0.3,1)',
        minHeight: '230px',
      }}
    >
      {/* ── Folder 3D Assembly ── */}
      <div
        style={{
          position: 'relative',
          height: '120px',
          width: '150px',
          marginBottom: '8px',
          perspective: '900px',
        }}
      >
        {/* Back panel */}
        <div
          style={{
            position: 'absolute',
            width: '96px',
            height: '70px',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.1)',
            background: backGrad,
            top: 'calc(50% - 35px)',
            left: 'calc(50% - 48px)',
            transformOrigin: 'bottom center',
            transform: hovered ? 'rotateX(-18deg) scaleY(1.04)' : 'rotateX(0deg)',
            transition: 'transform 700ms cubic-bezier(0.16,1,0.3,1)',
            zIndex: 10,
          }}
        />

        {/* Tab */}
        <div
          style={{
            position: 'absolute',
            width: '34px',
            height: '11px',
            borderRadius: '5px 5px 0 0',
            border: '1px solid rgba(255,255,255,0.1)',
            borderBottom: 'none',
            background: tabColor,
            top: 'calc(50% - 35px - 10px)',
            left: 'calc(50% - 48px + 10px)',
            transformOrigin: 'bottom center',
            transform: hovered ? 'rotateX(-28deg) translateY(-3px)' : 'rotateX(0deg)',
            transition: 'transform 700ms cubic-bezier(0.16,1,0.3,1)',
            zIndex: 10,
          }}
        />

        {/* Fanning preview cards */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            zIndex: 20,
          }}
        >
          {displayPreviews.map((item, i) => (
            <FolderCard
              key={item.id}
              ref={(el) => { cardRefs.current[i] = el; }}
              image={item.image}
              label={item.label}
              delay={i * 45}
              isVisible={hovered}
              index={i}
              totalCount={displayPreviews.length}
              onClick={onClick}
            />
          ))}
        </div>

        {/* Front panel */}
        <div
          style={{
            position: 'absolute',
            width: '96px',
            height: '70px',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.15)',
            background: frontGrad,
            top: 'calc(50% - 35px + 4px)',
            left: 'calc(50% - 48px)',
            transformOrigin: 'bottom center',
            transform: hovered ? 'rotateX(32deg) translateY(8px)' : 'rotateX(0deg)',
            transition: 'transform 700ms cubic-bezier(0.16,1,0.3,1)',
            zIndex: 30,
          }}
        >
          {/* Shine overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 'inherit',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, transparent 55%)',
              pointerEvents: 'none',
            }}
          />
          {/* Icon on front face */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: accentColor,
              opacity: hovered ? 0 : 0.85,
              transition: 'opacity 400ms ease',
            }}
          >
            {icon}
          </div>
        </div>
      </div>

      {/* ── Text ── */}
      <div style={{ textAlign: 'center', zIndex: 40 }}>
        <h3
          style={{
            fontSize: '14px',
            fontWeight: 900,
            color: '#fff',
            marginBottom: '2px',
            letterSpacing: hovered ? '-0.01em' : '0',
            transform: hovered ? 'translateY(2px)' : 'translateY(0)',
            transition: 'all 500ms ease',
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontSize: '11px',
            color: 'rgba(148,163,184,0.65)',
            fontWeight: 500,
            lineHeight: 1.35,
            maxWidth: '160px',
            margin: '0 auto',
            opacity: hovered ? 0.6 : 0.8,
            transition: 'opacity 500ms ease',
          }}
        >
          {subtitle}
        </p>
      </div>

      {/* Hover hint */}
      <div
        style={{
          position: 'absolute',
          bottom: '8px',
          left: '50%',
          transform: `translateX(-50%) translateY(${hovered ? '6px' : '0'})`,
          opacity: hovered ? 0 : 0.35,
          transition: 'all 500ms ease',
          fontSize: '9px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: 'rgba(148,163,184,0.6)',
          whiteSpace: 'nowrap',
        }}
      >
        hover to explore
      </div>

      {/* "Open" indicator on hover */}
      <div
        style={{
          position: 'absolute',
          bottom: '8px',
          left: '50%',
          transform: `translateX(-50%) translateY(${hovered ? '0' : '6px'})`,
          opacity: hovered ? 1 : 0,
          transition: 'all 500ms ease',
          fontSize: '10px',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: accentColor,
          whiteSpace: 'nowrap',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}
      >
        <span style={{ fontSize: '12px' }}>→</span> Click to open
      </div>
    </div>
  );
}
