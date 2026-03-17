export default function BackgroundClouds() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden -z-10 hidden md:block">
      <div className="ghibli-cloud" style={{ top: '15%', width: '300px', height: '150px', animationDelay: '0s' }} />
      <div className="ghibli-cloud" style={{ top: '45%', width: '450px', height: '200px', animationDelay: '-20s' }} />
      <div className="ghibli-cloud" style={{ top: '75%', width: '250px', height: '120px', animationDelay: '-40s' }} />
    </div>
  );
}
