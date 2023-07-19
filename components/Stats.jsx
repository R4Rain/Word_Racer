import { Avatar, Card, CardHeader, Typography } from "@material-tailwind/react"

const Stats = ({ image, image_alt, desc, rank }) => {
  return (
    <Card className="w-full p-3" shadow={false}>
      <CardHeader
        floated={false}
        shadow={false}
        color="transparent"
        className="m-0 flex items-center py-0 gap-4"
      >
        <Avatar
          size="lg"
          variant="circular"
          src={`/assets/${image}`}
          alt={image_alt}
        />
        <div className="flex flex-col items-center justify-center">
          <Typography variant="lead" className="text-gray-800">
            { desc }
          </Typography>
          <Typography variant="small" className="w-full text-gray-600 font-bold text-left">
            { rank }
          </Typography>
        </div>
      </CardHeader>
    </Card>
  )
}

export default Stats