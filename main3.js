function ActivateFunc(x, type = 2) //Функция активации
{
	if (type === 2) // сигмоида
	{
		var a = 1;
		return 1/(1+Math.exp(-a*x));
	}
	else if (type === 1) //пороговая
	{
		var a = 0.5;
		if (x < a)
		{
			return 0;
		} 
		else
		{
			return 1;
		}
	}
	else if (type === 0) //гистерезис
	{
		if ( x < 0)
			return 0;
		else if (x > 1)
			return 1;
		else
			return x;
	}

}

function ActivateFuncDer(x) //Произвоная от функции активации
{
	var AF = ActivateFunc(x);
	return AF*(1-AF);
}

class Neuron
{
	constructor(value = 0)
	{
		this.value = value;
		this.connects = [];
		this.valueDeact = 0;
		this.sigma = 0;
	}

	destructLayer(Layer)
	{
		for (var i = 0; i < Layer.neurons.length; i++)
		{
			this.connects.push(Layer.neurons[i], Math.random());
		}
	}

	calculateValue()
	{
		var sum = 0;
		for (var i = 0; i < this.connects.length; i+=2)
		{
			sum += this.connects[i].value * this.connects[i+1];
		}
		this.value = ActivateFunc(sum);
		this.valueDeact = sum;
	}
}
class Layer
{
	constructor()
	{
		this.neurons = [];
	}
	Add(Neuron1)
	{
		this.neurons.push(Neuron1);
	}
	calculateThisLayer()
	{

	}
}
class NeuralNetwork
{
	constructor(structure)
	{
		this.speedOfLearning = 0.5;
		this.step = 0;
		this.structure = structure;
		this.layers = []; 
		for (var i = 0; i < this.structure.length; i++)
		{
			var layer1 = new Layer();
			for (var j = 0; j < this.structure[i]; j++)
			{
				var neuron1 = new Neuron();
				if (i > 0)
				{
					neuron1.destructLayer(this.layers[i-1]);
				}
				layer1.Add(neuron1);
			}
			this.layers.push(layer1);
		}
	}

	ResultOne(input)
	{
		for (var i = 0; i < input.length; i++)
		{
			this.layers[0].neurons[i].value = input[i];
		}
		for (var i = 1; i< this.layers.length; i++)
		{
			for (var j = 0; j < this.layers[i].neurons.length; j++)
			{
				this.layers[i].neurons[j].calculateValue();
			}
		}
		var result = [];
		var resLayer = this.layers[this.layers.length-1];
		for (var i = 0; i < resLayer.neurons.length; i++)
		{
			result.push(resLayer.neurons[i].value);
		}
		return result;
	}

	TrainOne(input, output)
	{
		this.ResultOne(input)
		var outputNext = [];

		var i = this.layers.length-1;
		for (var j = 0; j < this.layers[i].neurons.length; j++)
		{
			var sigma = (output[j] - this.layers[i].neurons[j].value) * ActivateFuncDer(this.layers[i].neurons[j].valueDeact);
			this.layers[i].neurons[j].sigma = sigma;
			for (var k = 0; k < this.layers[i].neurons[j].connects.length; k += 2)
			{
				var deltaW = this.speedOfLearning * sigma * this.layers[i].neurons[j].connects[k].value; //z - значение нейрона, связь с которым я меняю
				this.layers[i].neurons[j].connects[k+1] += deltaW;
			}
			
		}
		//все остальные слои
		for (var i = this.layers.length-2; i >= 0; i--) //по слоям
		{
			for (var j = 0; j < this.layers[i].neurons.length; j++) //по нейронам
			{
				var sigmaIn = 0;

				for (var k = 0; k < this.layers[i+1].neurons.length; k++){
					sigmaIn += this.layers[i+1].neurons[k].sigma * this.layers[i+1].neurons[k].connects[2*j+1];
				}
				this.layers[i].neurons[j].sigma = sigmaIn*ActivateFuncDer(this.layers[i].neurons[j].valueDeact);
				for (var k = 0; k < this.layers[i].neurons[j].connects.length; k += 2)
				{
					var deltaW = this.speedOfLearning * this.layers[i].neurons[j].sigma * this.layers[i].neurons[j].connects[k].value; //z - значение нейрона, связь с которым я меняю
					this.layers[i].neurons[j].connects[k+1] += deltaW;
				}

			}
		}
	}

	PrintNetwork()
	{
		for (var i  = 0; i < this.layers.length; i++)
		{
			console.log("sloi: ", i);
			console.log(this.layers[i]);
			console.log("connects:");
			for (var j = 0; j < this.layers[i].neurons.length; j++)
			{
				console.log(this.layers[i].neurons[j].connects);
			}
			
		}
	}
}
//var NN1 = new NeuralNetwork([2, 5, 8, 2]);