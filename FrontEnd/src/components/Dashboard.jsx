import React from "react";
import { 
  ShoppingBag, ShoppingCart, Users 
} from "lucide-react";
import { 
  LineChart, Line, XAxis, YAxis, 
  ResponsiveContainer 
} from "recharts";


const salesData = [
  { name: "1 May", sales: 2500 },
  { name: "8 May", sales: 4200 },
  { name: "15 May", sales: 3200 },
  { name: "22 May", sales: 5500 },
  { name: "29 May", sales: 7200 },
];


const recentOrders = [
  {
    id: "#1234",
    date: "May 24, 2026",
    price: "$120.00",
    status: "Completed",
    color: "text-green-600 bg-green-50"
  },
  {
    id: "#1233",
    date: "May 24, 2026",
    price: "$85.00",
    status: "Completed",
    color: "text-green-600 bg-green-50"
  },
  {
    id: "#1232",
    date: "May 23, 2026",
    price: "$150.00",
    status: "Pending",
    color: "text-amber-600 bg-amber-50"
  },
  {
    id: "#1231",
    date: "May 22, 2026",
    price: "$200.00",
    status: "Completed",
    color: "text-green-600 bg-green-50"
  },
];


function Dashboard() {

  return (

    <main className="p-8 bg-gray-100 min-h-screen">


      {/* Header */}

      <div className="flex justify-between items-center mb-8">

        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, John Doe 👋
          </h1>

          <p className="text-gray-500 mt-2">
            Here's what's happening with your store today.
          </p>

        </div>


        <div className="bg-white px-5 py-3 rounded-lg shadow-sm">
          May 24, 2026
        </div>


      </div>



      {/* Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">


        <Card 
          title="Total Products"
          value="120"
          icon={<ShoppingBag />}
          color="text-green-600 bg-green-50"
        />


        <Card 
          title="Total Orders"
          value="320"
          icon={<ShoppingCart />}
          color="text-yellow-600 bg-yellow-50"
        />


        <Card 
          title="Customers"
          value="560"
          icon={<Users />}
          color="text-purple-600 bg-purple-50"
        />


        <Card 
          title="Revenue"
          value="$12,450"
          icon="$"
          color="text-red-600 bg-red-50"
        />


      </div>



      {/* Chart + Orders */}


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">


        {/* Chart */}

        <div className="bg-white p-6 rounded-xl shadow-sm lg:col-span-2">

          <h2 className="text-xl font-bold mb-5">
            Sales Overview
          </h2>


          <div className="h-72">


            <ResponsiveContainer width="100%" height="100%">


              <LineChart data={salesData}>


                <XAxis dataKey="name"/>

                <YAxis/>


                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                />


              </LineChart>


            </ResponsiveContainer>


          </div>


        </div>





        {/* Orders */}


        <div className="bg-white p-6 rounded-xl shadow-sm">


          <h2 className="text-xl font-bold mb-5">
            Recent Orders
          </h2>



          {
            recentOrders.map((order,index)=>(


              <div
                key={index}
                className="flex justify-between items-center py-4 border-b"
              >


                <div>

                  <h3 className="font-bold">
                    {order.id}
                  </h3>

                  <p className="text-sm text-gray-400">
                    {order.date}
                  </p>


                </div>



                <div className="text-right">


                  <p className="font-bold">
                    {order.price}
                  </p>


                  <span
                    className={`text-xs px-3 py-1 rounded-full ${order.color}`}
                  >
                    {order.status}
                  </span>


                </div>



              </div>


            ))
          }


        </div>



      </div>


    </main>

  );
}




function Card({title,value,icon,color}){


return (

<div className="bg-white p-6 rounded-xl shadow-sm">


<div className="flex justify-between">


<span className="text-gray-500 font-medium">
{title}
</span>


<div className={`p-3 rounded-lg ${color}`}>
{icon}
</div>


</div>


<h2 className="text-3xl font-bold mt-5">
{value}
</h2>


<p className="text-green-600 text-sm mt-2">
▲ 12% from last month
</p>


</div>

);


}



export default Dashboard;