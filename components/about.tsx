import Image from 'next/image';

export default function About() {
  const dentists = [
    {
      name: "Od. Ramón Mavarez",
      description: "Descripción del odontólogo Ramón Mavarez.",
      image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=facearea&w=400&h=400&facepad=2"
    },
    {
      name: "Od. Patricia Román",
      description: "Descripción de la odontóloga Patricia Román.",
      image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=facearea&w=400&h=400&facepad=2"
    },
    {
      name: "Dr. José Espinoza",
      description: "Descripción del doctor José Espinoza.",
      image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=facearea&w=400&h=400&facepad=2"
    }
  ];
  return (
    <section className="flex flex-col py-12 md:py-16 px-[5vw]" id="nosotros">
      <div>
        <h2 style={{ fontSize: '3.2rem', fontWeight: 'bold' }}>Conócenos</h2>
      </div>
      <div className="mt-8 grid gap-8 md:grid-cols-3">
        {dentists.map((dentist, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <Image src={dentist.image} alt={dentist.name} width={128} height={128} className="w-32 h-32 object-cover rounded-full mb-4"/>
            <h3 className="text-xl font-semibold mb-2">{dentist.name}</h3>
            <p className="text-gray-600 text-center">{dentist.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}