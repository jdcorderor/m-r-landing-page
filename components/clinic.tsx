import Image from "next/image";

export default function Clinic() {
    return (
      <section className="flex flex-col px-5 md:px-24 pt-18 md:pt-24 pb-12" id="consultorio">
        <h2 className="text-4xl md:text-5xl text-center font-bold px-10 mb-8 md:mb-14">Visita nuestras instalaciones.</h2>
        
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
          <div className="flex flex-col gap-6">
            <Image src="https://xhhlwhpqpjpkjvvekqbl.supabase.co/storage/v1/object/public/landingpage/consultorio.jpeg" alt="Consultorio" width={500} height={300} className="w-full md:h-90 object-cover rounded-lg"/>
            <div className="flex flex-col gap-1 md:gap-2 text-center md:text-left bg-gray-50 p-6 border border-gray-200 rounded-lg">
              <h4 className="text-lg font-bold">C.C. El Parral, Piso 1, Oficina 116</h4>
              <p className="">Horario: 8:00 AM a 2:00 PM</p>
            </div>
          </div>

          <div className="w-full rounded-lg h-55 md:h-auto">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2000.037798736754!2d-69.28891356138514!3d10.061087597511873!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e87670b60fee3ff%3A0x299f395e8a85ba60!2sConsultorio%20dentistol%C3%B3gico%20Dr%20Ram%C3%B3n%20Mavarez!5e0!3m2!1ses!2sve!4v1748920040093!5m2!1ses!2sve" 
            width="100%" height="100%" allowFullScreen={true} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="rounded-lg"></iframe>
          </div>
        </div>
      </section>
    );
}