import {
  FaShippingFast,
  FaShieldAlt,
  FaHeadset,
  FaUndoAlt,
} from "react-icons/fa";

function Features() {
  const features = [
    {
      id: 1,
      icon: <FaShippingFast />,
      title: "Free Shipping",
      subtitle: "On all orders over $50",
    },
    {
      id: 2,
      icon: <FaShieldAlt />,
      title: "Secure Payment",
      subtitle: "100% secure payment",
    },
    {
      id: 3,
      icon: <FaHeadset />,
      title: "24/7 Support",
      subtitle: "Dedicated support",
    },
    {
      id: 4,
      icon: <FaUndoAlt />,
      title: "Easy Returns",
      subtitle: "30 day return policy",
    },
  ];

  return (
    <section className="bg-white py-8">
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

          {features.map((feature) => (
            <div
              key={feature.id}
              className="flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl">
                {feature.icon}
              </div>

              <div>
                <h3 className="font-semibold">
                  {feature.title}
                </h3>

                <p className="text-sm text-gray-500">
                  {feature.subtitle}
                </p>
              </div>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default Features;