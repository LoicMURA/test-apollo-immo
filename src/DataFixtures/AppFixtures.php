<?php

namespace App\DataFixtures;

use App\Entity\Voiture;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager)
    {
        $faker = Factory::create('fr_FR');

        for ($i = 0; $i < 35; $i++) {
            $car = new Voiture();
            $car->setName($faker->name)
                ->setDescription(join("\n", $faker->paragraphs()))
                ->setCreatedAt($faker->dateTimeBetween('-12 months'));

            $manager->persist($car);
        }

        $manager->flush();
    }
}
