import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import db from "@/db/db";
import { formatCurency, formatNumber } from "@/lib/formatters";

async function getSaleData() {
    const data =  await db.order.aggregate({
        _sum: {pricePaidInCents: true},
        _count: true
    })
    await wait (2000)
    return {
        amount: (data._sum.pricePaidInCents || 0) / 100,
        numberOfSales: data._count
    }
}

function wait(duration: number) {
    return new Promise(resolve => setTimeout(resolve, duration))
}

async function getUserData() {
    const [userCount, orderData] = await Promise.all([
        db.user.count(),
        db.order.aggregate({
            _sum: {pricePaidInCents: true}
        }),
    ])

    return {
        userCount,
        averageValuePerUser: userCount === 0 ? 0 : (orderData._sum.pricePaidInCents || 0) / 100
    }
}

async function getProductData(){
    const [activeCount, inactiveCount] = await Promise.all([
        db.product.count({where: {isAvailableForPurchase: true}}),
         db.product.count({where: {isAvailableForPurchase: false}})
    ])

    return {activeCount, inactiveCount}
}


export default async function AdminDashboard() {
    const [salesData, userData, productData] = await Promise.all([
        getSaleData(),
        getUserData(),
        getProductData()
    ])
   
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <DashboardCard title="Sales" subtitle={`${formatNumber 
                (salesData.numberOfSales)} Orders`} body={formatCurency (salesData.amount)} 
                />

             <DashboardCard title="Customers" subtitle={`${formatCurency (userData.averageValuePerUser)
                } Average Value`} body={formatNumber (userData.userCount)} 
                />

                <DashboardCard title="Active Products" subtitle={`${formatNumber (productData.inactiveCount)
                } inactive`} body={formatNumber (productData.activeCount)} 
                />
        </div>
    )
}

type DashboarProps = {
    title: string
    subtitle: string
    body: string
}

function DashboardCard({title, subtitle, body}: DashboarProps) {
    return(
    <Card>
    <CardHeader>
        <CardTitle>{title}</CardTitle> 
       
    <CardDescription>{subtitle}</CardDescription>
    </CardHeader>
    <CardContent>{body}</CardContent>
</Card>
    )
}